'use client'
import React, { useState, useEffect } from 'react';

interface IUsers {
	Id_USERS: number;
	username: string;
	avatar_path: string;
	status: number;
	token_2FA: string;
	has_2FA: string;
}


export default function page() {
	return (
		<div className="flex 
		items-center 
		justify-end 
		m-4 
		p-2 
		text-center 
		text-xl 
		font-semibold
		bg-neutral-900 rounded-lg
		">
			<div>Chat</div>
			<div className=" text-red-700 text-2xl font-black">.</div>
		</div>
	);
}


