import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface UserSocket {
	username: string;
	socketID: string;
}

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
	private messagesObj: ChatMessage[] = [];
	private clients: UserSocket[] = [];

	handleConnection(@ConnectedSocket() client: Socket) {
		const username = client.handshake.query.username as string;
		client.join('homeRoom');
		console.log('NEW CONNEXION CLIENT, id = ' + client.id);
		this.clients.push({ username, socketID: client.id });
		this.server
			.to(client.id)
			.emit('welcome', 'Bienvenue sur le chat room principal');

		// this.server.to(client.id).emit('getallmsg', this.messages);
		this.server.to(client.id).emit('getallmsgObj', this.messagesObj);
	}

	handleDisconnect(client: Socket) {
		// Code pour gérer les déconnexions client
		console.log('CLIENT ' + client.id + ' left');
	}

	@SubscribeMessage('message')
	handleMessage(client: Socket, payload: string) {
		console.log(client.id + ': ' + payload);
		this.messages.push(payload);
		this.server.to(client.id).emit('response', payload);
		// client.broadcast.to('homeRoom').emit('response', payload);
		client.emit('hello', 'world');
	}

	@SubscribeMessage('messageObj')
	handleMessageObj(client: Socket, payload: ChatMessage) {
		console.log(client.id + ': ' + payload);
		this.messagesObj.push(payload);
		this.server.to('homeRoom').emit('responseObj', payload);
		// client.broadcast.to('homeRoom').emit('responseObj', payload);
	}
}
