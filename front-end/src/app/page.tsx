'use client'

import Link from 'next/link'
import React, { useState } from 'react'

export default function Home() {
	const [isLogged, setIsLogged] = useState<boolean>(false);
	


	return (
		<>
			<div>Home</div>

			<div>Veuillez vous identifier</div>
			
			<Link href={`/login/`}>LOGIN</Link>
		</>
	)
}
