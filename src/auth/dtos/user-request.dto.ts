import { IsNotEmpty } from 'class-validator';
import { UserInterface } from 'src/users/interfaces/user.interface';

export class UserRequestDto {
  @IsNotEmpty()
  user: UserInterface;
}
