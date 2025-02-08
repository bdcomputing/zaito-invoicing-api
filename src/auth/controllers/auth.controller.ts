import {
  Body,
  Controller,
  Post,
  UseGuards,
  Headers,
  Req,
} from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { SignInDto } from '../dtos/sign-in.dto';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { AuthService } from '../services/auth.service';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  /**
   * Constructor for AuthController class.
   * @param {AuthService} authService - The authentication service.
   * @param {UsersService} usersService - The users service.
   */
  constructor(private readonly authService: AuthService) {
    //
  }

  @Public()
  @ApiResponse({
    status: HttpStatusCodeEnum.OK,
    description: 'The user logged in successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
    @GenericResponse() res: GenericResponse,
    @Req() req: any,
  ) {
    const response = await this.authService.signIn(signInDto, req);
    res.setStatus(response.statusCode);
    return response;
  }

  /**
   * Refresh the Auth token
   *
   * @param {RefreshTokenDto} refreshTokenDto
   * @return {*}
   * @memberof AuthController
   */
  // @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @Req() req: any,
  ) {
    return this.authService.refreshAccessToken(
      refreshTokenDto.refresh_token,
      req,
    );
  }

  @UseGuards(AuthenticationGuard)
  @Post('logout')
  async invalidateToken(@Headers('authorization') authorization: string) {
    const token = authorization.split(' ')[1];
    await this.authService.invalidateToken(token);
    return { message: 'Token invalidated successfully' };
  }
}
