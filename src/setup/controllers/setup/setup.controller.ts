import { Body, Controller, Post } from '@nestjs/common';
import { SyncSuperAdminDto } from 'src/setup/dto/sync-db.dto';
import { SetupService } from 'src/setup/services/setup/setup.service';
import { CustomHttpResponse } from 'src/shared';

@Controller('setup')
export class SetupController {
  constructor(private readonly setupService: SetupService) {
    //
  }
  /**
   * creates the superuser data.
   *
   * This endpoint triggers creating the superuser data throughout the application.
   */
  @Post('get-started')
  async createSuperUser(
    @Body() user: SyncSuperAdminDto,
  ): Promise<CustomHttpResponse> {
    return await this.setupService.createSuperUser(user);
  }
}
