import React from 'react'
import axios from 'axios'

export default function ProfileUser({params}: {params: { username: string}}) {

	//reauete api pour avoir les infos de l'user sur localhost:8000/api/users/username

	return (
		<div>ProfileUser {params.username}</div>
	)
}
