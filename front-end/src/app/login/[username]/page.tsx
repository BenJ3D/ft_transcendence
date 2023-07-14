'use client'
import React, {useEffect, useState} from 'react'
import axios from 'axios'

export default function Login({params}: {params: { username: string}}) {

	const [isLogged, setIsLogged] = useState<boolean>(false);


	useEffect(() => {
		const user = {
			username: params.username,
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
	}, []);

	return (
		<>
			<div>Login</div>
			<div>username : {params.username} </div>
		</>
	);
}
