'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function ProfileUser({params}: {params: { username: string}}) {

	const [tmp, setTmp] = useState<string>('NON');
	

	console.log('PorfileUser HelloWorld');
	
	useEffect(() => {
		
		console.log('PorfileUser useEffect HelloWorld');

		//requete api pour avoir les infos de l'user sur localhost:8000/api/users/username
		axios.get(`/localhost:8000/api/users/username/${params.username}`)
		.then((reponse) => {
			setTmp('query status = ' + reponse.status);
		})
		.catch((e) => {
			console.log(e);
		})
	});
		
	return (
		<div>ProfileUser {params.username}</div>
	)
}
