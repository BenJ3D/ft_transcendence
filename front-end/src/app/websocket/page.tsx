'use client'

import WebsocketClient from './websocket.client';
import ChatClient from '../../Components/chat/chat';

export default function ChatRoom() {
	return (
		<>
			<h1 className="text-xl md:text-xl lg:text-xl font-bold text-center my-5">
				WEBSOCKET - CHAT PROTOTYPE le vrai ben cest 'BenReal id=_6oW9XA5X7vIJU1EAAAh' !!!
			</h1>

			<WebsocketClient className='' classNameBlockMessage='m-6 overflow-auto h-[350px]'/>
		</>
	);
}

