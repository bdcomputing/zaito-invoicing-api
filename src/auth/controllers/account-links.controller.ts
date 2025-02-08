import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth/account-links')
export class AccountLinksController {
  @Post('link-client')
  async linkAccountToClient(@Body() body: any) {
    console.log('Linking Account to Client', body);
  }
}
