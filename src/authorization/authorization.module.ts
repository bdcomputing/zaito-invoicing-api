import { Global, Module } from '@nestjs/common';
import { AuthorizationController } from './controllers/authorization.controller';
import { authorizationProviders } from './providers/providers';
import { AuthorizationService } from './services/authorization.service';
import { UsersModule } from 'src/users/users.module';
import { PermissionsGuard } from './guards/permission.guard';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';

@Global()
@Module({
  controllers: [AuthorizationController, RolesController],
  imports: [UsersModule],
  providers: [
    AuthorizationService,
    PermissionsGuard,
    ...authorizationProviders,
    RolesService,
  ],
  exports: [
    AuthorizationService,
    PermissionsGuard,
    ...authorizationProviders,
    RolesService,
  ],
})
export class AuthorizationModule {
  //
}
