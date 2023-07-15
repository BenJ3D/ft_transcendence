import React from 'react'
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");
socket.on("message", (data) => {
  console.log(data); // "Hello world!"
});



export default function Websocket() {


	return (
		<div>Bijour</div>
	)
}
