'use client'

import WebsocketClient from './websocket.client';
import ChatClient from '../../Components/chat/chat';

export default function ChatRoom() {
	return (
		<>
			<h1 className="text-xl md:text-xl lg:text-xl font-bold text-center my-5">
				WEBSOCKET - CHAT PROTOTYPE
			</h1>
			<WebsocketClient className='' classNameBlockMessage='m-6 overflow-auto h-[350px]'/>
		</>
	);
}

