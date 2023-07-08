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
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		socketRef.current = io("http://localhost:8000");

		if (socketRef.current) {
			socketRef.current.on("connect", () => {
				console.log("Connected to WebSocket server");
			});
			socketRef.current.on("message", (message: string) => {
				console.log("Received message:", message);
				setMessages((prevMessages) => [...prevMessages, message]);
			});
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		};
	}, []);

	const sendMessage = () => {
		if (socketRef.current) {
			let messObj: ChatMessage = {
				clientId : 1,
				clientPsedo : 'bducrocq',
				message : ''
			};

			socketRef.current.emit("message", messObj);
			setMessages((prevMessages) => [...prevMessages, message]);
			setMessage("");
		} else {
			console.error("Tried to send a message before socket is connected");
		}
	};

	return (
		<div>
			<input
				type="text"
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				className=" text-neutral-900"
			/>
			<button onClick={sendMessage}>Send</button>

			<ul>
				{messages.map((msg, index) => (
					<li key={index}>{msg}</li>
				))}
			</ul>
		</div>
	);
}
