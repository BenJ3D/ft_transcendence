import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server;

  handleConnection(client: Socket) {
    // Code pour gérer les nouvelles connexions client
    console.log('NEW CONNEXION CLIENT : ' + client.id);
  }

  handleDisconnect(client: Socket) {
    // Code pour gérer les déconnexionsclient
    console.log('CLIENT ' + client.id + ' left');
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any) {
    // Code pour gérer les messages entrants

    // Émettez une réponse au client
    this.server.emit('response', 'Received your message!');
  }
}
