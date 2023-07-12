import Link from 'next/link'
import React from 'react'

export default function Home() {
	return (
		<>
			<div>Home</div>
			<Link href='/42oauth'>LOGIN</Link>
		</>
	)
}
