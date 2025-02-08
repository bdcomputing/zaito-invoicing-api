import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { UsersService } from 'src/users/services/users.service';
import { JwtPayloadInterface } from 'src/auth/interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);
  /**
   * Creates an instance of JwtRefreshTokenStrategy.
   * @param {UsersService} usersService
   * @param {ConfigService} configService
   * @memberof JwtRefreshTokenStrategy
   */
  constructor(
    private readonly usersService: UsersService,
    public readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get('JWT_ACCESS_TOKEN_SECRET') || 'this-is-a-secret',
    });
  }

  /**
   * Validate the user using the payload of the JWT token.
   * @param {JwtPayloadInterface} payload - The payload of the JWT token.
   * @return {Promise<any>} - The user if found, otherwise an UnauthorizedException is thrown.
   * @throws {UnauthorizedException} - If the user is not found.
   * @memberof JwtRefreshTokenStrategy
   */
  async validate(payload: JwtPayloadInterface): Promise<any> {
    const user = await this.usersService.findOne(
      payload.sub as unknown as string,
    );
    if (!user) {
      this.logger.error('User not found');
      throw new UnauthorizedException();
    }
    return user;
  }
}
