import React from 'react'
import users from '../../db/mock/users.json'

export default function page() {

	users.map(user => {
		console.log(user.username);
	})
	return (
		<div>Voir console pour test username
			<br/>
				Liste des username connecter :
			<br/>
			<ul>
        {users.map((user: any) => (
          <li key={user.id + '42kjhskjsadfsadfhdskjhds' }>{user.username}</li>
        ))}
      </ul>


		</div>
	)
}
