import {useState, useEffect, useRef} from "react";
import io, {Socket} from "socket.io-client";

interface ChatMessage {
	clientId: number;
	clientPsedo: string;
	message: string;
}

export default function WebsocketClient() {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<string[]>([]);
	
	const [username, setUsername] = useState("");
	const [chatMsg, setChatMsg] = useState<ChatMessage>();
	const [chatMsgs, setChatMsgs] = useState<ChatMessage[]>([]);

	const socketRef = useRef<Socket | null>(null); //avant detre generer il est null (pour faire plaisir a Prettier/ESLint) 

	useEffect(() => {
		socketRef.current = io("http://localhost:8000");

		if (socketRef.current) {
			socketRef.current.on("connect", () => {
				console.log("Connected to WebSocket server");
			});
			socketRef.current.on("message", (message: string) => {
				console.log("Received message:", message);
				setMessages((prevMessages) => [...prevMessages, message]);
				console.log('All messages = ' + messages)
			});
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		};
	}, []);

	const sendMessageObj = (msg: string) => {
		if (socketRef.current) {
			let messObj: ChatMessage = {
				clientId : 1,
				clientPsedo : 'bducrocq',
				message : msg
			};
			console.log('DBG DEBUUUUUG => '  + msg)
			socketRef.current.emit("message", msg);
			setMessages((prevMessages) => [...prevMessages, message]);
			setMessage("");
		} else {
			console.error("Tried to send a message before socket is connected");
		}
	};

	const sendMessage = () => {
		if (socketRef.current) {
			let messObj: ChatMessage = {
				clientId : 1,
				clientPsedo : 'bducrocq',
				message : ''
			};

			socketRef.current.emit("message", messObj, message);
			setMessages((prevMessages) => [...prevMessages, message]);
			setMessage("");
		} else {
			console.error("Tried to send a message before socket is connected");
		}
	};

	return (
		<div>
			username : 
			<input
				type="text"
				value={username}
				onChange={(b) => setUsername(b.target.value)}
				className="text-red-900"
			/>
			<br/>
			<br/>
			message : 
			<input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				className="text-neutral-900"
			/>
			<button onClick={() => sendMessageObj(message)}>Send</button>

			<ul className="m-6 ">
				{messages.map((msg, index) => (
					<>
						<div className=' bg-gray-800 flex flex-col p-2 m-2 rounded-xl whitespace-normal'>

						<li className=" text-blue-700 text-sm justify-start" key={username}>{username}</li>
						<li className=' flex-grow ' key={index}>{msg}</li>
						</div>
					</>
				))}
			</ul>
		</div>
	);
}

//TODO: envoi tous les messages quand connexion client
//TODO: quand nouveau message, lenvoyer a tous les clients