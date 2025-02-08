/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { UsersService } from 'src/users/services/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'jwt-decode';
import { SystemEventsEnum } from 'src/events/enums/events.enum';
import { ExtendedReqDto, SignInDto } from '../dtos/sign-in.dto';
import { JwtRefreshTokenStrategy } from '../strategies/jwt-refresh-token.strategy';
import { RedisService } from '../../redis/services/redis.service';
import { PermissionInterface } from 'src/authorization/interfaces/permission.interface';
import { CreateAuthLogDto } from 'src/logger/dto/auth-log.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

  /**
   * Creates an instance of AuthService.
   * @param {JwtService} jwtService
   * @param {UsersService} usersService
   * @param {RefreshTokenIdsStorage} redisService
   * @param {SettingsService} settingsService
   * @param {NotificationsService} notificationsService
   * @param {OtpService} otpService
   * @memberof AuthService
   */
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {
    //
  }

  /**
   *Authenticate the user using email and Password
   *
   * @param {SignInDto} signInDto
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthService
   */
  async signIn(signInDto: SignInDto, req: any): Promise<CustomHttpResponse> {
    const payload: ExtendedReqDto = {
      payload: signInDto,
      originalReq: req,
    };
    const res = await this.validateUser(payload);
    return await this.authenticate(res, req);
  }

  /**
   * Validate the user
   *
   * @param {string} email
   * @param {string} password
   * @return {*}  {Promise<any>}
   * @memberof AuthService
   */
  async validateUser(req: ExtendedReqDto): Promise<any> {
    const signInDto: SignInDto = req.payload as SignInDto;
    try {
      const res = (await this.usersService.getUserUsingEmail(signInDto.email))
        .data;
      const user = res.user;
      if (user) {
        if (await this.validatePassword(user.password, signInDto.password)) {
          return Promise.resolve(res);
        } else {
          // save the logs
          const authLog: CreateAuthLogDto = {
            email: signInDto.email,
            loginSuccess: false,
            originalReq: req.originalReq,
          };
          this.eventEmitter.emit(SystemEventsEnum.AddAuthLog, authLog);
          return null;
        }
      }
    } catch (error) {
      // save the logs
      const authLog: CreateAuthLogDto = {
        email: signInDto.email,
        loginSuccess: false,
        originalReq: req.originalReq,
      };
      this.eventEmitter.emit(SystemEventsEnum.AddAuthLog, authLog);
      return null;
    }
  }

  /**
   * Authenticate User
   *
   * It takes user from strategy and generates authentication tokens and returns permissions
   *
   * @param {*} res
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthService
   */
  async authenticate(res: any, originalReq: any): Promise<CustomHttpResponse> {
    try {
      const { permissions } = await res;
      const user: UserInterface = await res.user;

      if (!user) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.UNAUTHORIZED,
          'Invalid email or password',
          null,
        );
      }
      if (user && !user.isActive) {
        return new CustomHttpResponse(
          HttpStatusCodeEnum.UNAUTHORIZED,
          'Your Account is Suspended. Please contact the system admin for Recovery',
          null,
        );
      }

      user.password = undefined;
      const payload = { sub: user._id, email: user.email, permissions };

      const access_token = await this.jwtService.signAsync(payload);

      const refresh_token = await this.jwtService.signAsync(payload, {
        expiresIn: '30d',
      });

      // Store the refresh token in redis
      await this.redisService.saveRefreshToken(user.id, refresh_token);
      delete user.password;

      const data = {
        access_token,
        refresh_token,
        user,
        permissions,
      };

      // save the logs
      const authLog: CreateAuthLogDto = {
        userId: user._id.toString(),
        email: user.email,
        loginSuccess: true,
        originalReq,
      };
      this.eventEmitter.emit(SystemEventsEnum.AddAuthLog, authLog);

      // return the success response
      return new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        `Hey ${user.name}, You are logged in successfully!`,
        data,
      );
    } catch (error) {
      return new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        `Login failed, check credentials`,
        null,
      );
    }
  }
  /**
   * Refresh the auth token
   *
   * @param {string} refreshToken
   * @return {*}  {Promise<{ access_token: string }>}
   * @memberof AuthService
   */
  async refreshAccessToken(refreshToken: string, req: any) {
    try {
      const ip: string = req.ip;
      const decoded = await this.jwtService.verifyAsync(refreshToken);
      // get the user
      const payload: {
        user: UserInterface;
        permissions: PermissionInterface[];
      } = await (
        await this.usersService.getUserUsingId(decoded.sub)
      ).data;
      // authenticate the user and send back the response
      return this.authenticate(payload, ip);
    } catch (error) {
      this.logger.error(`Error: ${error}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Validate User using Email (Magic Login)
   *
   * @param {string} email
   * @return {*}
   * @memberof AuthService
   */
  async verifyUser(email: string) {
    this.logger.log(`Validating user with email ${email}....`);
    const user = (await this.usersService.findByEmail(email)).data;

    if (!user) {
      throw new UnauthorizedException(
        'An error occurred while authenticating user',
      );
    }
    return user;
  }

  /**
   * Invalidate the user token on logout
   *
   * @param {string} accessToken
   * @return {*}  {Promise<void>}
   * @memberof AuthService
   */
  async invalidateToken(accessToken: string): Promise<void> {
    try {
      const decoded = await this.jwtService.verifyAsync(accessToken);
      await this.redisService.invalidate(decoded.sub);
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  /**
   * Validate the user password
   *
   * @param {string} password
   * @param {string} userPassword
   * @return {*}  {Promise<boolean>}
   * @memberof AuthService
   */
  async validatePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    const verified = await bcrypt.compare(userPassword, password);
    return verified;
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload: JwtPayload = this.jwtService.verify(token, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
    });

    const userId = payload.sub;

    if (userId) {
      return this.usersService.findOne(userId);
    }
  }
}
