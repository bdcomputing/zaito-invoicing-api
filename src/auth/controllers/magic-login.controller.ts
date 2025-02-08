import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CustomHttpResponse } from 'src/shared';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';
import { MagicLoginDto } from '../dtos/magic-login.dto';
import { MagicLoginGuard } from '../guards/magic-login.guard';
import { MagicLoginStrategy } from '../strategies/magic-login.strategy';
import { UserInterface } from 'src/users/interfaces/user.interface';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';
@ApiTags('Authentication')
@Controller('auth/magic-login')
export class MagicLoginController {
  /**
   * Creates an instance of MagicLoginController.
   * @param {AuthService} authService
   * @param {MagicLoginStrategy} strategy
   * @memberof MagicLoginController
   */
  constructor(
    private readonly authService: AuthService,
    private readonly strategy: MagicLoginStrategy,
  ) {}

  /**
   * Request for a Magic Login Link
   *
   * @param {*} req
   * @param {*} res
   * @param {MagicLoginDto} body
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof MagicLoginController
   */
  @Post()
  async magicLogin(
    @Req() req,
    @Res() res,
    @GenericResponse() _res: GenericResponse,
    @Body(new ValidationPipe()) body: MagicLoginDto,
  ): Promise<CustomHttpResponse> {
    const response: { user: UserInterface } = await this.authService.verifyUser(
      body.destination,
    );
    const { user } = response;
    let finalRes: CustomHttpResponse;
    if (!user.magicLogin) {
      finalRes = new CustomHttpResponse(
        HttpStatusCodeEnum.BAD_REQUEST,
        'Magic login disabled for this email address. Contact the admin to enable it or check your app security settings',
        null,
      );
    } else {
      this.strategy.send(req, res);
      finalRes = new CustomHttpResponse(
        HttpStatusCodeEnum.OK,
        'Email has been sent with login link',
        null,
      );
    }

    // set status code
    _res.setStatus(finalRes.statusCode);

    // return response
    return finalRes;
  }

  /**
   * Validate the Magic Login Link and sign a JWT Token for the user
   *
   * @param {*} req
   * @return {*}
   * @memberof MagicLoginController
   */
  @Get('callback')
  @UseGuards(MagicLoginGuard)
  async callback(@Req() req) {
    return await this.authService.authenticate(req.user, req);
  }
}
