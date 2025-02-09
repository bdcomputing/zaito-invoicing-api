import { IsNotEmpty } from 'class-validator';
import { User } from 'src/users/interfaces/user.interface';

export class UserRequestDto {
  @IsNotEmpty()
  user: User;
}
