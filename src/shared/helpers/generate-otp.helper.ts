import { UserInterface } from 'src/users/interfaces/user.interface';
import { DateHelper } from './date.helper';
import { GenerateOTPDto } from 'src/otp/dto/generate-otp.dto';
import { generatePassword } from '../utils/password-generator.util';

export function GenerateOTPHelper(user: UserInterface) {
  const { phone } = user;

  const OTP: GenerateOTPDto = {
    code: GenerateRandomNumber(),
    phone,
    isActive: true,
    expiry: DateHelper(undefined),
  };
  return OTP;
}

/**
 * Generate password reset code
 *
 * @export
 * @return {*}  {{
 *   code: string;
 *   expiry: number;
 * }}
 */
export function GeneratePasswordResetOTPHelper(): {
  code: string;
  expiry: number;
} {
  const code = `${generatePassword({
    length: 2,
    includeSpecialChars: false,
  })}${GenerateRandomNumber()}${generatePassword({
    length: 2,
    includeSpecialChars: false,
  })}`;

  const response: { code: string; expiry: number } = {
    code: code.toUpperCase(),
    expiry: DateHelper(undefined),
  };
  return response;
}
function GenerateRandomNumber() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
