import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

let clientid: string;

interface ChatMessage {
	clientId: number;
	clientPsedo: string;
	message: string;
}

@WebSocketGateway({ cors: true })
export class WebsocketGateway
	implements OnGatewayConnection, OnGatewayDisconnect
{
	@WebSocketServer()
	private server: Server;
	private messages: string[] = [];

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
	handleMessage(client: Socket, payload: ChatMessage) {
		console.log(
			client.id +
				': ' +
				payload.clientId +
				'/' +
				payload.clientPsedo +
				' says: ' +
				payload.message,
		);
		this.server.to(client.id).emit('response', 'Received your message!');
		this.server.to(client.id).emit('response', 'Received your message!');
	}
}
