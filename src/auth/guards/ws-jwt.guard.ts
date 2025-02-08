import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (context.getType() !== 'ws') {
      return true;
    }
    const client: Socket = context.switchToWs().getClient();
    WsJwtGuard.validateToken(client);
    return true;
  }

  static validateToken(client: Socket) {
    const { authorization } = client.handshake.auth.authorization
      ? client.handshake.auth
      : client.handshake.headers;

    const token: string = authorization.split(' ')[1];
    const JWT_ACCESS_TOKEN_SECRET =
      process.env.JWT_ACCESS_TOKEN_SECRET || 'this-is-a-secret';

    const payload = verify(token, JWT_ACCESS_TOKEN_SECRET);
    return payload;
  }
}
