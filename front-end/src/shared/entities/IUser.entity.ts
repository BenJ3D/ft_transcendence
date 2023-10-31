import {IMessageEntity} from './IMessage.entity';
import {IUserCredentialEntity} from './ICredential.entity';
import {IInviteEntity} from './IInvite.entity';
import {IMuteEntity} from './IMute.entity';
import {IBannedEntity} from './IBanned.entity';
import {IChannelEntity} from './IChannel.entity';

export enum UserStatus {
	INGAME = 2,
	ONLINE = 1,
	OFFLINE = 0,
}

export interface IUserEntity {
	UserID: number;
	login: string;
	nickname: string;
	visit: boolean;
	has_2fa: boolean;
	avatar_path: string;
	status: UserStatus;
}
