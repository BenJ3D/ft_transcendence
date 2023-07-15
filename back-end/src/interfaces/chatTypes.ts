export interface ChatMessage {
	clientId: number;
	clientSocketId?: string;
	clientPsedo: string;
	message: string;
}