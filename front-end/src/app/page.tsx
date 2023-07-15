'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import ButtonDBG from '@/Components/button/btn_dbg';
import Link from 'next/link';


export default function Home() {
	const [isLogged, setIsLogged] = useState<boolean>(false);
	return (
		<>
			<main className="flex min-h-screen flex-col items-center justify-between p-24">HOME PAGE
			<nav className='flex flex-col items-center justify-between p-24 m-5'>
				<Link href='/websocket' className=' text-4xl'> GO TO CHAT PROTO </Link>
				<Link href='/game' className=' text-4xl'> GO TO GAME PROTO </Link>
			</nav>
        
        <>
        <div>Home</div>

			  <div>Veuillez vous identifier</div>
			
		  	<Link href={`/login/`}>LOGIN</Link>
       </>
			</main>
		</>
	);
}
