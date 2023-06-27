import React from 'react'
import './game.css'

let scoreP1 = 1;
let scoreP2 = 2;

interface playerScoreboard {
	playerId: number;
	positionInGame: 'left' | 'right';
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
					<div className="min-w-[6px] max-w-[15px] min-h-[10px] max-h-[70px] bg-zinc-800 rounded-sm shadow m-6" />
				</>
	return ret
}

function getPlayerScore(player: playerScoreboard)
{
	return player.positionInGame === 'left' ? scoreP1 : scoreP2
}

function addGoal(position: 'left' | ' right' ): void{
	if (position === 'left')
		scoreP1++;
	else
		scoreP2++;
	console.log("Score:\nP1: " + scoreP1 + '\nP2: ' + scoreP2 );
}

function ScoreDisplay({player}: {player: playerScoreboard})
{
	return (
		player.positionInGame === 'left' ?
		<div className="text-center text-teal-700 text-[5vw] font-normal">{getPlayerScore(player)}</div> :
		<div className='flex justify-end'>
			<div className="text-center text-teal-700 text-[5vw] font-normal">{getPlayerScore(player)}</div> 
		</div>
	)
}

export default function page() {
	return (
			<section className='flex justify-center my-[13%]'>
				<div className="flex justify-between w-1/3 bg-game-blue rounded-2xl" 
					style={{ height: "calc(40vw * 10 / 16) " }}>
					<Player />
					<ScoreDisplay player={{playerId: 1, positionInGame:'left'}}/>
					<ScoreDisplay player={{playerId: 2, positionInGame:'right'}}/>
					<Player />
			 	</div>
			</section>

	)
}
{/* <div className="boxgame"></div> */}
