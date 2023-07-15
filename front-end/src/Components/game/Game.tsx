"use client";

import React, {useState, useEffect, useRef, MutableRefObject} from "react";
import "./game.css";
import ButtonDBG from "@/Components/button/btn_dbg";

interface playerScoreboard {
	playerId: number;
	positionInGame: "left" | "right";
	score: number;
}

function Background() {
	return <></>;
}

function Player(): React.JSX.Element {
	let ret: React.JSX.Element;
	ret = (
		<>
			<div className="min-w-[0.65vw] max-w-[3vw] min-h-[1vw] max-h-[3vw] bg-zinc-800 rounded-sm shadow m-6"/>
		</>
	);
	return ret;
}

function ScoreDisplay({player}: {player: playerScoreboard}) {
	return player.positionInGame === "left" ? (
		<div className="text-center text-teal-700 text-[5vw] font-normal">
			{player.score}
		</div>
	) : (
		<div className="flex justify-end">
			<div className="text-center text-teal-700 text-[5vw] font-normal">
				{player.score}
			</div>
		</div>
	);
}

export default function Game() {
	const [scoreP1, setScoreP1] = useState(0);
	const [scoreP2, setScoreP2] = useState(0);
	const [barPositionP1, setBarPositionP1] = useState(0);
	const [keysPressed, setKeysPressed] = useState({});
	const gameDivRef = useRef(null);
	const barRef = useRef(null);

	function addGoal(position: "left" | "right"): void {
		if (position === "left") {
			setScoreP1(scoreP1 + 1);
		} else {
			setScoreP2(scoreP2 + 1);
		}
	}

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			setKeysPressed((keysPressed) => ({...keysPressed, [event.key]: true}));
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			setKeysPressed((keysPressed) => ({...keysPressed, [event.key]: false}));
		};

		window.addEventListener("keydown", handleKeyDown);
		window.addEventListener("keyup", handleKeyUp);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, []);

	useEffect(() => {
		let animationFrameId;

		const movePlayer = () => {
			const gameDivHeight = gameDivRef.current?.offsetHeight;
			const barHeight = barRef.current?.offsetHeight;

			setBarPositionP1((prevPosition) => {
				let newPosition = prevPosition;
				if (keysPressed["ArrowUp"]) {
					newPosition = Math.max(newPosition - gameDivHeight * 0.02, 0);
				} else if (keysPressed["ArrowDown"]) {
					newPosition = Math.min(newPosition + gameDivHeight * 0.05, gameDivHeight - barHeight);
				}
				return newPosition;
			});

			if (keysPressed["ArrowUp"] || keysPressed["ArrowDown"]) {
				animationFrameId = requestAnimationFrame(movePlayer);
			}
		};

		movePlayer();

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [keysPressed]);

	return (
		<main className=" bg-blue-app min-h-screen py-[12vw]">
			<section className="flex justify-center">
				<ButtonDBG param={{f: () => addGoal("left"), text: "ADD GOAL P1"}} />
				<div
					ref={gameDivRef}
					className="flex justify-between w-1/3 bg-blue-game rounded-2xl"
					style={{height: "calc(40vw * 10 / 16) "}}
				>
					<Player />
					<ScoreDisplay
						player={{playerId: 1, positionInGame: "left", score: scoreP1}}
					/>
					<ScoreDisplay
						player={{playerId: 2, positionInGame: "right", score: scoreP2}}
					/>
					<div
						ref={barRef}
						className="min-w-[0.65vw] max-w-[3vw] min-h-[1vw] max-h-[3vw] bg-zinc-800 rounded-sm shadow mx-3 my-0"
						style={{transform: `translateY(${barPositionP1}px)`}}
					></div>
				</div>
				<ButtonDBG param={{f: () => addGoal("right"), text: "ADD GOAL P2"}} />
			</section>
		</main>
	);
}
