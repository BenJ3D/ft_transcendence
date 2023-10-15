import {userInfoSocket, EGameMod} from 'shared/typesGame';
import {Server} from 'socket.io';
import {GameSession} from './GameSession';
import {v4 as uuidv4} from "uuid";
import {GameService} from '../game.service';


export class Matchmaking {
	private userTab: userInfoSocket[] = [];

	constructor(
		private gameService: GameService,
	) {
	}

	public getUsersNumber(): number {
		return this.userTab.length
		// return this.userStack.size()
	}

	//for check double addition protection in addUser
	private containsUser(user: userInfoSocket): boolean {
		return this.userTab.some(element => element.user.UserID === user.user.UserID);
	}

	//add user if not already present
	public addUser(user: userInfoSocket): void {
		if (!this.containsUser(user)) {
			this.userTab.push(user);
		} else {
			user.socket.emit('alreadyInMatchmaking');
			console.log(`User(${user.user.login}) is already in matchmaking list`) //TODO: NOTIF : 'Already in matchmaking (with second session ?)'
		}
	}

	//remove user if present
	public removeUser(user: userInfoSocket): void {
		if (this.containsUser(user)) {
			// let index = this.userTab.findIndex(u => u.user.UserID === user.user.UserID);
			this.userTab.map((ref) => {console.log(ref.user.login + ' | ')})
			this.userTab = this.userTab.filter((userRef) => userRef.user.UserID !== user.user.UserID)
			this.userTab.map((ref) => {console.log(ref.user.login + ' | ')})
				console.log(`User(${user.user.login}) has been removed from the matchmaking list`)
			}
		 else
			console.log(`User(${user.user.login}) is not in matchmaking list`)
	}

	//create game instance for 1v1 classic game
	public createGame(server: Server, game_id: number, gameMod: EGameMod): GameSession {
		if (this.getUsersNumber() >= 2) {
			const P1: userInfoSocket = this.userTab.pop();
			const P2: userInfoSocket = this.userTab.pop();
			const startDate: Date = new Date();
			const generateSessionName: string = uuidv4();
			console.log(`NEW GAME SESSION: ${generateSessionName} | ${P1.user.nickname}(${P1.user.login}) vs ${P2.user.nickname}(${P2.user.login})`);
			return new GameSession(server, P1, P2, startDate, game_id, gameMod, generateSessionName, this.gameService);
		} else
			console.log('Matchmaking: Pas assez de joueurs pour lancer une partie');
	}
}
