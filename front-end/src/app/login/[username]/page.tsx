'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

interface User {
  Id_USERS: number;
  username: string;
  avatar_path: string | null;
  status: number;
  token_2FA: string;
  has_2FA: boolean;
};


export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { username } = router.query;

  useEffect(() => {
    if (username) {
      axios.get(`http://localhost:8000/api/users/username/${username}`)
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [username]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
<h1>{user.username}&apos;s Profile</h1>
      <p>Avatar Path: {user.avatar_path}</p>
      <p>Status: {user.status}</p>
      <p>Token 2FA: {user.token_2FA}</p>
      <p>Has 2FA: {user.has_2FA ? 'Yes' : 'No'}</p>
    </div>
  );
}
