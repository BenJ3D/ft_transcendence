'use client'

import React, {useContext, useEffect, useState} from 'react'
import HomePage from "@/components/HomePageComponent";
import {authManager, getApi} from "@/components/api/ApiReq";
import {useRouter} from "next/navigation";
import LoadingComponent from "@/components/waiting/LoadingComponent";
import {getUserMe} from "@/app/auth/Auth";

export default function ShowHomePage() {
	const router = useRouter();
	const [isTokenExists, setIsTokenExists] = useState(false);

	useEffect(() => {
		authManager.setBaseURL('http://' + window.location.href.split(':')[1].substring(2) + ':8000/api/');

		const token = localStorage.getItem("token");
		if (!token)
			router.push("/auth");
		else
			setIsTokenExists(true);
	});
	console.log("Home page loaded");
	return (
		isTokenExists ?
			<HomePage className={""}/> : <LoadingComponent/>
	)
}
