import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

let msg: string;
let clientid: string;

@WebSocketGateway({ cors: true })
export class WebsocketGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	private server: Server;

	handleConnection(client: Socket) {
		// Code pour gérer les nouvelles connexions client
		clientid = client.id;
		console.log('NEW CONNEXION CLIENT, id = ' + clientid);
	}

	handleDisconnect(client: Socket) {
		// Code pour gérer les déconnexionsclient
		console.log('CLIENT ' + client.id + ' left');
	}

	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: any) {
		// Code pour gérer les messages entrants
		console.log(client.id + ': ' + payload);
		// Émettez une réponse au client
		this.server.emit('response', 'Received your message!');
	}
}
