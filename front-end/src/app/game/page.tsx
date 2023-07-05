'use client'

import React from 'react'
import './game.css'
import ButtonDBG from '@/Components/button/btn_dbg';

// let scoreP1 = 1;
// let scoreP2 = 2;

interface playerScoreboard {
	playerId: number;
	positionInGame: 'left' | 'right';
	score: number;
}

function Background () {
	return (
		
		<>
		
		</>
	)
}

function Player() {
	let ret;
	
	ret =	<>
					<div className="min-w-[0.65vw] max-w-[3vw] min-h-[2vw] max-h-[7vw] bg-zinc-800 rounded-sm shadow m-6" />
				</>
	return ret
}

function ScoreDisplay({player}: {player: playerScoreboard})
{
	return (
		player.positionInGame === 'left' ?
		<div className="text-center text-teal-700 text-[5vw] font-normal">{player.score}</div> :
		<div className='flex justify-end'>
			<div className="text-center text-teal-700 text-[5vw] font-normal">{player.score}</div> 
		</div>
	)
}

export default function Page() {
	const [scoreP1, setScoreP1] = React.useState(0);
	const [scoreP2, setScoreP2] = React.useState(0);
	
	function addGoal(position: 'left' | 'right'): void {
		if (position === 'left') {
			setScoreP1(scoreP1 + 1);
		} else {
			setScoreP2(scoreP2 + 1);
		}
	}

	return (
		<main className=' bg-blue-app min-h-screen py-[13vw]'>
			<section className='flex justify-center'>
					<ButtonDBG param={{f: () => addGoal('left'), text: 'ADD GOAL P1'}}/>
				<div className="flex justify-between w-1/3 bg-blue-game rounded-2xl" 
					style={{ height: "calc(40vw * 10 / 16) " }}>
					<Player />
					<ScoreDisplay player={{playerId: 1, positionInGame:'left', score: scoreP1}}/>
					<ScoreDisplay player={{playerId: 2, positionInGame:'right', score: scoreP2}}/>
					<Player />
			 	</div>

					<ButtonDBG param={{f: () => addGoal('right'), text: 'ADD GOAL P2'}}/>
			</section>
		</main>

	)
}
{/* <div className="boxgame"></div> */}

