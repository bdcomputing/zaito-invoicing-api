import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { UsersService } from 'src/users/services/users.service';
import { JwtPayloadInterface } from 'src/auth/interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtRefreshTokenStrategy.name);

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
   * @memberof JwtStrategy
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
