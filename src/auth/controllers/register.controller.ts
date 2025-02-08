import { Body, Controller, Post, Req } from '@nestjs/common';
import { SignInDto } from 'src/auth/dtos/sign-in.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { RegisterPatientDto } from 'src/patients/dto/patient.dto';
import { PatientService } from 'src/patients/services/patient.service';
import { CustomHttpResponse } from 'src/shared';
import { GenericResponse } from 'src/shared/decorators/generic-response.decorator';
import { HttpStatusCodeEnum } from 'src/shared/enums/status-codes.enum';

@Controller('auth/register')
export class RegisterController {
  /**
   * Constructor for RegisterController class.
   * @param {AuthService} authService - The authentication service.
   * @param {UsersService} usersService - The users service.
   */
  constructor(
    private readonly authService: AuthService,
    private readonly patientService: PatientService,
  ) {
    //
  }

  /**
   * Register an account for a patient
   *
   * @param {RegisterPatientDto} patientDto
   * @return {*}  {Promise<CustomHttpResponse>}
   * @memberof AuthController
   */
  @Post('patient')
  async registerClient(
    @Body() patientDto: RegisterPatientDto,
    @GenericResponse() res: GenericResponse,
    @Req() req: any,
  ): Promise<CustomHttpResponse> {
    // register the user
    let response = await this.patientService.createPatient(patientDto);

    // set status code
    res.setStatus(response.statusCode);
    if (response.statusCode !== HttpStatusCodeEnum.CREATED) {
      return response;
    }

    const { email, password } = patientDto;

    // login
    const signInDto: SignInDto = {
      email,
      password,
    };

    // await sign-in response
    response = await this.authService.signIn(signInDto, req);

    // set status code
    res.setStatus(response.statusCode);
    // return response
    return response;
  }
}
