import {useState, useEffect, useRef} from "react";
import io, {Socket} from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
	clientId: number;
	clientPsedo: string;
	message: string;
}

const max_msg_lenght: number = 512;

export default function WebsocketClient() {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<string[]>([]);

	const [username, setUsername] = useState("");
	const [chatMsg, setChatMsg] = useState<ChatMessage>();
	const [chatMsgs, setChatMsgs] = useState<ChatMessage[]>([]);

	const socketRef = useRef<Socket | null>(null); //avant detre generer il est null (pour faire plaisir a Prettier/ESLint)
	const messagesEndRef = useRef<any>(null);

	useEffect(() => {
		socketRef.current = io("http://localhost:8000");

		if (socketRef.current) {
			socketRef.current.on("connect", () => {
				console.log("Connected to WebSocket server");
			});
			socketRef.current.on("message", (message: string) => {
				console.log("Received message:", message);
				setMessages((prevMessages) => [...prevMessages, message]);
				console.log("All messages = " + messages);
			});
		}

		return () => {
			if (socketRef.current) {
				socketRef.current.disconnect();
			}
		};
	}, []);

	//Faire en sorte que l'on suive toujours les derniers messages //TODO: faire une bool pour si on remonte la liste des messages
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
	}, [messages]);

	const sendMessageObj = (msg: string) => {
		if (username.trim().length === 0) {
			alert("Username ne doit pas être vide ou ne contenir que des espaces");
			return;
		}
		if (msg.trim().length === 0) return;
		else if (msg.length >= max_msg_lenght) {
			alert(
				"Votre message doit faire moins de 512 charactere ;) (desolé abucia tu ne me le peteras pas avec ça xD)"
			);
			setMessage("");
			return;
		}
		if (socketRef.current) {
			let messObj: ChatMessage = {
				clientId: 1,
				clientPsedo: "bducrocq",
				message: msg,
			};
			console.log("DBG DEBUUUUUG => " + messObj.message);
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
				clientId: 1,
				clientPsedo: "bducrocq",
				message: "",
			};

			socketRef.current.emit("message", messObj, message);
			setMessages((prevMessages) => [...prevMessages, message]);
			setMessage("");
		} else {
			console.error("Tried to send a message before socket is connected");
		}
	};

	return (
		<>
			<div>
				<ul className="m-6 max-h-[32rem] overflow-auto ">
					{messages.map((msg, index) => (
						<div key={"blocMessage-" + uuidv4()} className=" ">
							<li className=" text-neutral-400 font-semibold text-base justify-start ml-4"> {username} </li>
							<li className=" bg-gray-800 flex flex-col p-2 ml-2 mb-4 rounded-xl max-w-max min-w-[10rem]">
								{" "}
								{msg}{" "}
							</li>
						</div>
					))}
					<div ref={messagesEndRef} />{" "}{/*//sert de cible pour le scrolling bas auto a chaque msg*/}
					
				</ul>
			</div>
		<>
				<div className="bg-slate-900 m-10 p-5">
					<p className="text-neutral-500">username :</p>
					<div className="flex items-center max-w-max">
						<input
							type="text"
							value={username}
							onChange={(b) => setUsername(b.target.value)}
							className=" bg-neutral-800 text-red-500 flex-grow rounded-lg h-8 p-4"
						/>
					</div>





					<br />
					<br />





					<p className="text-neutral-500">message :</p>
					<div className="flex items-center max-w-max">
						<input
							type="text"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") sendMessageObj(message);
							}}
							className="text-zinc-200 bg-neutral-800 flex-grow rounded-lg h-8 p-4"
						/>
						<button onClick={() => sendMessageObj(message)} className=" ml-5">
							<img
								src="/chat/send.svg"
								alt="Send"
								className="max-w-[2rem] min-w-[1rem]"
							/>
						</button>
					</div>
				</div>
			</>
		</>
	);
}

//TODO: envoi tous les messages quand connexion client
//TODO: quand nouveau message, lenvoyer a tous les clients
