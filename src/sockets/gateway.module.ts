import { Global, Module } from '@nestjs/common';
import { AppWebSocketGateway } from './gateway.ws';
import { TasksGateway } from './gateways';

@Global()
@Module({
  providers: [AppWebSocketGateway, TasksGateway],
})
export class SocketGatewayModule {}
