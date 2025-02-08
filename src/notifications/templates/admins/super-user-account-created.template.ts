/* eslint-disable prettier/prettier */
import { appName } from 'src/shared/constants/constants';
import { RegisterEmployeeDto } from 'src/users/dto/register-employee.dto';

export const SuperUserAccountCreatedEmailTemplate = (
  employee: RegisterEmployeeDto,
) => {
  const css = '';
  const template = `
  <div style="text-align: left;">
  <h4><b>  Dear ${employee.name},</b></h4><br>
  <p>
  Welcome to the ${appName}! We are thrilled to have you on board as part of our dynamic team, and we're looking forward to embarking on this exciting journey together. 
  </p>
  <br>
<p>Your super user account has been created successfully</p>
<p>To Login, use : <br> 
<b>Email: </b> ${employee.email} <br> 
<b>Password: </b> ${employee.password}  
</p>
  <p>
  Get ready for an incredible journey with ${appName}! <br>
  </p>
  <p>
  Best regards, <br>
  ${appName} Team
  </p>
  </div>
  `;

  return { template, css };
};
