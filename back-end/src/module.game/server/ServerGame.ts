import {Injectable} from '@nestjs/common';
import {Matchmaking} from './Matchmaking';
import {GameSession} from './GameSession';
import {RemoteSocket, Server, Socket} from 'socket.io';
import {userInfoSocket, EGameMod} from 'shared/typesGame';
import {v4 as uuidv4} from "uuid";
import {GameService} from '../game.service';
import { IChallenge, IUser } from 'shared/types';
import { ChallengeManager } from './ChallengeManager'
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { getToken } from 'src/module.auth/auth.guard';
import { channelsDTO } from 'shared/DTO/InterfaceDTO';

// @Injectable()
// export class gameSocketService {
//     constructor(private websocketGatewayGame: WebsocketGatewayGame) {}
// }

@Injectable()
export class ServerGame {
	// gameService: GameService;
	constructor(
		private gameService: GameService,
	) {
		// server = new Server;
	};

	private matchmaking: Matchmaking = new Matchmaking(this.gameService);
	private matchmakingGhost: Matchmaking = new Matchmaking(this.gameService);
	private gameSession: GameSession[] = [];
	private trainningSession: GameSession[] = []; //pour ne pas les melangers, pas de spectator, donc pas besoin de get cette liste
	private challengeList: ChallengeManager[] = []//FIXME:


	public addPlayerToMatchmaking(player: userInfoSocket, server: Server) {
		if (!player)
			return console.log('addPlayerToMatchmaking: Error player')
		this.matchmaking.addUser(player);
		console.log(`${player.user.login}: add in matchmaking list`);
		if (this.matchmaking.getUsersNumber() >= 2) {
			this.gameSession.push(this.matchmaking.createGame(server, this.gameSession.length, EGameMod.classic));
		}

	}

	public addPlayerToMatchmakingGhost(player: userInfoSocket, server: Server) {
		if (!player)
			return console.log('addPlayerToMatchmakingGhost: Error player')
		this.matchmakingGhost.addUser(player);
		console.log(`${player.user.login}: add in matchmakingGhost list`);
		if (this.matchmakingGhost.getUsersNumber() >= 2) {
			this.gameSession.push(this.matchmakingGhost.createGame(server, this.gameSession.length, EGameMod.ghost));
		}
	}

	public removePlayerToMatchmaking(player: userInfoSocket) {
		if (!player)
			return console.log('removePlayerToMatchmaking: Error player')
		this.matchmaking.removeUser(player);
		console.log(`${player.user.login}: remove in matchmaking list`);
	}

	public removePlayerToMatchmakingGhost(player: userInfoSocket) {
		if (!player)
			return console.log('removePlayerToMatchmakingGhost: Error player')
		this.matchmakingGhost.removeUser(player);
		console.log(`${player.user.login}: remove in matchmaking list`);
	}

	public addPlayerInTrainningSession(player: userInfoSocket, server: Server) {
		if (!player)
			return console.log('addPlayerToMatchmaking: Error player');
		this.trainningSession.push(this.createTrainningSessionGame(server, 0, player));
	}

	public getGameSession(game_id: number): GameSession {
		this.gameSession.forEach((game) => {
			if (game.getGameId() === game_id)
				return game;
		})
		return null;
	}

	//create game instance for solo trainnig game
	private createTrainningSessionGame(server: Server, game_id: number, player: userInfoSocket): GameSession {

		const startDate: Date = new Date();
		const generateSessionName: string = uuidv4();
		console.log(`NEW TRAINING SESSION: ${generateSessionName} | ${player.user.nickname})`);
		return new GameSession(server, player, player, startDate, game_id, EGameMod.trainning, generateSessionName, this.gameService);
	}


	public getAllGameSession(): GameSession[] {
		return this.gameSession;
	}

	public leftConnectionUserMatchmaking(playerSocket: Socket) {
		this.matchmaking.leftConnection(playerSocket)
		this.matchmakingGhost.leftConnection(playerSocket)
	}

	public createGame(server: Server, p1: userInfoSocket, p2: userInfoSocket, gameMod: EGameMod) {
		const startDate: Date = new Date();
		const generateSessionName: string = uuidv4();
		console.log(`NEW CHALLENGE GAME: ${generateSessionName}  ${p2.user.nickname} vs ${p1.user.nickname})`);
		return new GameSession(server, p1, p2, startDate, this.gameSession.length, gameMod, generateSessionName, this.gameService);
	}

	private async cleanChallenge() {
		return this.challengeList = this.challengeList.filter((challenge) => challenge.getIsArchivate() !== true)
	}

	public createChallenge(server: Server, challenger: userInfoSocket, challenged: IUser, gameMod: EGameMod, sockersChallenged: RemoteSocket<DefaultEventsMap, any>[]) {
		// console.log('debug challengerID = ' +  JSON.stringify(challenger.user))
	
		this.cleanChallenge();
		// console.log('debug challenge list length: ' , this.challengeList.length)
		if (!this.alreadyInChallenge(challenger.user.UserID))
			this.challengeList.push(new ChallengeManager(server, challenger, challenged, sockersChallenged, this.createGame, gameMod))
		else
			challenger.socket.emit('info', 'Vous etes deja en challenge')
	}

	public alreadyInChallenge(challengerID: number) {
		return this.challengeList.some((elem) => elem.isChallenger(challengerID))
	}

	public getAllChallengeUser(userID: number): channelsDTO.IChallengeProposeDTO [] {
		const list: ChallengeManager[] = this.challengeList.filter((challenge) => challenge.containUserInChallenge(userID) && !challenge.isChallenger(userID))
		const listAllPropose: channelsDTO.IChallengeProposeDTO[] = [];
		list.map((element) => {listAllPropose.push(element.getProposeChallenge())})

		return listAllPropose;
	}

}