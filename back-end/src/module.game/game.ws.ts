import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	ConnectedSocket,
	MessageBody,
} from '@nestjs/websockets';

import {RemoteSocket, Server, Socket} from 'socket.io';
import {ServerGame} from 'src/module.game/server/ServerGame';
import {wsChatRoutesBack, wsGameRoutes} from 'shared/routesApi';
import {userInfoSocket} from 'shared/typesGame';
import {Param, UseGuards, ValidationPipe} from '@nestjs/common';
import {UserEntity, UserStatus} from '../entities/user.entity';
import {CurrentUser} from '../module.auth/indentify.user';
import {WSAuthGuard, getToken} from "../module.auth/auth.guard";
import {accessToken} from '../dto/payload';
import {JwtService} from '@nestjs/jwt';
import { UsersService } from 'src/module.users/users.service';
import { CreateChallengeDTOPPipe } from 'src/dto.pipe/channel.dto';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';



class SocketUserList {
	userID: number;
	socketID: string;
}
@WebSocketGateway({
	namespace: '/game',
})
export class WebsocketGatewayGame
	implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private serverGame: ServerGame, 
		private jwtService: JwtService,
		private usersService: UsersService,

		) {
	}

	@WebSocketServer()  
	public server: Server;
	private socketUserList: SocketUserList[] = [];

	async handleConnection(@ConnectedSocket() client: Socket) {
		console.log('NEW CONNEXION WS CLIENT THEGAME, id = ' + client.id);
		const tokenInfo = getToken(client);

		const type = tokenInfo.type;
		const token = tokenInfo.token;
		if (type !== 'Bearer')
			return client.disconnect();
		let userID: number;

		// console.log('token game = ' + token)
		try {
			const payloadToken: accessToken = await this.jwtService.verifyAsync(
				token,
				{
					secret: process.env.SECRET_KEY,
				},
			);
			userID = payloadToken.id;
		} catch {

			return client.disconnect();
		}
		const user = await this.usersService.findOne(userID, ['channelJoined', 'subscribed'])
		.catch(() => null);
		
		if (user == null)
			return client.disconnect();
		this.server.to(client.id).emit('welcome', 'Bienvenue sur TheGame');//FIXME:
		client.emit('welcome', 'Bienvenue sur TheGame');//FIXME:
		this.socketUserList.push({
			socketID: client.id,
			userID: userID,
		});
		console.log('+1 ws game list = ', JSON.stringify(this.socketUserList))
	}

	async handleDisconnect(client: Socket) {
		console.log('CLIENT ' + client.id + ' left');
		this.serverGame.leftConnectionUserMatchmaking(client)

		const tokenInfo = getToken(client);

		const type = tokenInfo.type;
		const token = tokenInfo.token;
		if (type !== 'Bearer') return client.disconnect();
		if (!token) return client.disconnect();
		let payloadToken: accessToken;
		try {
			payloadToken = await this.jwtService.verifyAsync(token, {
				secret: process.env.SECRET_KEY,
			});
		} catch {
				return client.disconnect();
		}
		const user = await this.usersService
			.findOne(payloadToken.id)
			.catch(() => null);
		if (!user)
			return client.disconnect();
		this.socketUserList = this.socketUserList.filter(value => value.socketID != client.id);
		console.log(`CLIENT ${client.id} left CHAT WS`);
		return client.disconnect();
	}

	emitToGameRoom(room: string, payload: any) {
		this.server.emit(room, payload)
	}

	@SubscribeMessage(wsGameRoutes.addNewPlayerToServer())
	@UseGuards(WSAuthGuard)
	welcomeToGameServer(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		console.log(client.id + '= ' + user.login + 'is connected to serverGame instance');
		//TODO: save user in list user ? useless ? yes i thinks better with sql request for check online user
		client.emit('welcome', 'Bienvenue sur le game server'); //message dacceuil connection websocket
	}

	@SubscribeMessage(wsGameRoutes.addPlayerToMatchmaking())
	@UseGuards(WSAuthGuard)
	addPlayerToMatchmaking(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		// console.log(client.id + ': ' + payload.nickname);
		// console.log('json user: ' + JSON.stringify(payload));

		const player: userInfoSocket = {socket: client, user};
		this.serverGame.addPlayerToMatchmaking(player, this.server);
		client.emit('info', `Matchmaking: attente d\'autres joueurs...`);
	}

	@SubscribeMessage(wsGameRoutes.addPlayerToMatchmakingGhost())
	@UseGuards(WSAuthGuard)
	addPlayerToMatchmakingGhost(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		// console.log(client.id + ': ' + payload.nickname);
		// console.log('json user: ' + JSON.stringify(payload));

		const player: userInfoSocket = {socket: client, user};
		this.serverGame.addPlayerToMatchmakingGhost(player, this.server);
		client.emit('info', `MatchmakingGhost: attente d\'autres joueurs...`);
	}

	@SubscribeMessage(wsGameRoutes.removePlayerToMatchmaking())
	@UseGuards(WSAuthGuard)
	RemoveUserToMatchmaking(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		// console.log(`TRY removePlayerToMatchnaking:  ${payload.nickname}`);
		const player: userInfoSocket = {socket: client, user};
		this.serverGame.removePlayerToMatchmaking(player);
		// client.emit('info', `Matchmaking: attente d\'autres joueurs...`);
	}

	@SubscribeMessage(wsGameRoutes.removePlayerToMatchmakingGhost())
	@UseGuards(WSAuthGuard)
	RemoveUserToMatchmakingGhost(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		// console.log(`TRY removePlayerToMatchnaking:  ${payload.nickname}`);
		const player: userInfoSocket = {socket: client, user};
		this.serverGame.removePlayerToMatchmakingGhost(player);
		// client.emit('info', `Matchmaking: attente d\'autres joueurs...`);
	}


	@SubscribeMessage(wsGameRoutes.createTrainningGame())
	@UseGuards(WSAuthGuard)
	createTrainningGame(
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity
	) {
		// console.log(client.id + ': ' + payload.nickname);
		// console.log('json user: ' + JSON.stringify(payload));
		const player: userInfoSocket = {socket: client, user};
		this.serverGame.addPlayerInTrainningSession(player, this.server);
		client.emit('info', `Trainning game loading...`);
	}


	@SubscribeMessage(wsChatRoutesBack.createChallenge())
	@UseGuards(WSAuthGuard)
	async createChallengeGame(
		@MessageBody() data: CreateChallengeDTOPPipe,
		@ConnectedSocket() client: Socket,
		@CurrentUser() user: UserEntity,
	) {
		// console.log('OK Create challenge , target id = ', data.targetID);
		
		const P1: userInfoSocket = { socket: client, user: user };

		const sockersChallenged: RemoteSocket<DefaultEventsMap, any>[]= await this.getSocket(data.targetID);
		// console.log(JSON.stringify(sockersChallenged))
		const P2: UserEntity = await this.usersService.findOne(data.targetID)
		sockersChallenged.forEach((socket) => {
			console.log('send to socket : ' + socket);
			socket.emit('info', 'hello Challenged')
		})
		console.log('map lenght = ' , sockersChallenged.length);
		this.serverGame.createChallenge(this.server, P1, P2, data.gameMod, sockersChallenged);
		// console.log(client.id + ': ' + payload.nickname);
		// console.log('json user: ' + JSON.stringify(payload));
		const player: userInfoSocket = {socket: client, user};
		// this.serverGame.createChallenge(this.server, ) //TODO: TODO:

		// client.emit('info', `Challenge requested...`); 
	}

	private async getSocket(userID: number) {
    const socketIDLst = this.socketUserList.filter(value => value.userID === userID);
    const socketLst = await this.server.fetchSockets();

    return socketLst.filter(socket => {
        return socketIDLst.some(Id => Id.socketID === socket.id);
    });
}

	/**
	 * Return a List of all the Socket used by the User
	 * */
	// private async getSocket(userID: number) {
	// 	const indexes = this.socketUserList.map(
	// 		value => userID == value.userID
	// 	);
	// 	const socketIDLst = this.socketUserList.filter((value, index) => indexes[index]);
	// 	const socketLst = await this.server.fetchSockets();

	// 	return socketLst.filter(socket => {
	// 		for (const Id of socketIDLst) {
	// 			console.log('id = ', Id.socketID);
	// 			if (Id.socketID == socket.id)
	// 				return true;
	// 		}
	// 		return false;
	// 	})
	// }
}
