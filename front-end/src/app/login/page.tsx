'use client'
import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function Page() {
	const [username, setUsername] = useState('')
	const [tmpInput, setTmpInput] = useState('')

	const [isLogged, setIsLogged] = useState<boolean>(false);

	useEffect(() => {
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
