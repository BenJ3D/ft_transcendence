'use client'

import WebsocketClient from './websocket.client';
import ChatClient from '../../Components/chat/chat';

export default function ChatRoom() {
	return (
		<div>
			WEBSOCKET PAGE 2
			<WebsocketClient />
			<div className='flex justify-center'>
			{/* <ChatClient /> */}
			
			
			</div>
		</div>
	);
}

