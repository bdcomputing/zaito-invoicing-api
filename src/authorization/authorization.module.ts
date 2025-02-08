import { Global, Module } from '@nestjs/common';
import { AuthorizationController } from './controllers/authorization.controller';
import { authorizationProviders } from './providers/providers';
import { AuthorizationService } from './services/authorization.service';
import { UsersModule } from 'src/users/users.module';
import { AuthorizationGuard } from './guards/authorization.guard';
import { RolesController } from './controllers/roles.controller';
import { RolesService } from './services/roles.service';

@Global()
@Module({
  controllers: [AuthorizationController, RolesController],
  imports: [UsersModule],
  providers: [
    AuthorizationService,
    AuthorizationGuard,
    ...authorizationProviders,
    RolesService,
  ],
  exports: [
    AuthorizationService,
    AuthorizationGuard,
    ...authorizationProviders,
    RolesService,
  ],
})
export class AuthorizationModule {
  //
}
