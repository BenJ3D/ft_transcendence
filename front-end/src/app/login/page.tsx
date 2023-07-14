'use client'
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation' // Importez useRouter

export default function Page() {
	const [username, setUsername] = useState<string | null>(null)
	const [tmpInput, setTmpInput] = useState<string>('')

	const [isLogged, setIsLogged] = useState<boolean | null>(null); // Initialisez isLogged à null

	const router = useRouter() // Initialisez useRouter

	useEffect(() => {
		if (username === null)
			return;
		const user = {
			username: username,
			avatar_path: null,
			status: 1,
			token_2FA: "token4",
			has_2FA: false,
		};

		axios
			.post("http://localhost:8000/api/users/", user)
			.then((response) => {
				if (response.status === 201)
					setIsLogged(true)
				else
					setIsLogged(false)
				console.log(response.data);
			})
			.catch((error) => {
				setIsLogged(false)
				console.error(error);
			});
	}, [username]);

	// Ajoutez ce hook useEffect pour surveiller les changements de isLogged
	useEffect(() => {
		if (isLogged === true) { // Vérifiez si isLogged est true avant de rediriger
			router.push(`/profile/${username}`) // Naviguez vers la page de profil de l'utilisateur
		}
	}, [isLogged, router, username])

	return (
		<>
			<div className=' flex justify-center p-5 font-semibold text-xl'>PROTOTYPE - LOGIN PAGE</div>
			<div className=' flex flex-col items-center justify-center p-6'>

			<input
							type="text"
							value={tmpInput}
							onChange={(b) => setTmpInput(b.target.value)}
							className=" bg-neutral-800 text-red-500 flex-grow rounded-lg h-8 p-4"
						/>
						<button onClick={() => {console.log(`press login, value = ${tmpInput}`); setUsername(tmpInput); setTmpInput('')} } 
						className="ml-5">
							LOGIN
						</button>

			</div>
			
		</>
	)
}
