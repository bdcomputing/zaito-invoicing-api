import { OnModuleInit, UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ServerToClientEvents } from './events';
import { WsJwtGuard } from 'src/auth/guards/ws-jwt.guard';
import { SocketAuthMiddleware } from './middlewares/ws.middleware';
import { OnEvent } from '@nestjs/event-emitter';
import { SystemEventsEnum } from '../events/enums/events.enum';
import { ReleasesDto } from 'src/shared/dto/releases.dto';
import { apiVersion } from 'src/shared';
import { appName } from 'src/shared/constants/constants';

/**
 * App Web Socket gateway
 *
 * @export
 * @class AppWebSocketGateway
 * @implements {OnModuleInit}
 * @implements {OnGatewayInit}
 * @implements {OnGatewayDisconnect}
 */
@WebSocketGateway({ cors: true })
@UseGuards(WsJwtGuard)
export class AppWebSocketGateway
  implements
    OnModuleInit,
    OnGatewayInit,
    OnGatewayDisconnect,
    OnGatewayConnection
{
  private readonly connectedClients: Map<string, Socket> = new Map();
  constructor() {
    //
  }
  @WebSocketServer()
  server: Server<any, ServerToClientEvents>;

  /**
   * On Module initialization
   *
   * @memberof AppWebSocketGateway
   */
  onModuleInit() {
    this.server.on('connection', (client: Socket) => {
      const clientId = client.id;
      this.connectedClients.set(clientId, client);
    });
  }

  /**
   * On Gateway init
   *
   * @param {Socket} client
   * @memberof AppWebSocketGateway
   */
  afterInit(client: Socket) {
    client.use(SocketAuthMiddleware() as any);
  }
  /**
   * Handle connection
   *
   * @memberof AppWebSocketGateway
   */
  handleConnection() {
    // Enable CORS for WebSocket
    this.server.emit('headers', {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
    });
  }

  handleDisconnect(client: Socket) {
    const clientId = client.id;
    this.connectedClients.delete(clientId);
  }

  @OnEvent(SystemEventsEnum.SendNewVersionOut, { async: true })
  async sendReleaseOut(data: ReleasesDto) {
    this.server.emit('newRelease', {
      message: `🚀 There is a new version of the ${appName}`,
      api: apiVersion,
      appVersion: data.appVersion,
    });
  }
}
