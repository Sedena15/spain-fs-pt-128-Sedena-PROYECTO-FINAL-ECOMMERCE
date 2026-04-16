import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar.jsx";
import { LoginRegisterModal } from "../components/LoginRegisterModal.jsx";
import { CartModal } from "../components/CartModal.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Layout = () => {
	const { dispatch } = useGlobalReducer();

	const [isloginregisterOpen, setLoginRegisterOpen] = useState(false);
	const [loginregisterTab, setLoginRegisterTab] = useState("login");
	const [isCartOpen, setIsCartOpen] = useState(false);

	useEffect(() => {
		const savedUser = localStorage.getItem("user");

		if (savedUser) {
			dispatch({
				type: "set_user",
				payload: JSON.parse(savedUser)
			});
		}
	}, []);

	const openLogin = () => {
		setLoginRegisterTab("login");
		setLoginRegisterOpen(true);
	};

	const openRegister = () => {
		setLoginRegisterTab("register");
		setLoginRegisterOpen(true);
	};

	const handleLogout = () => {
		localStorage.removeItem("user");

		dispatch({
			type: "set_user",
			payload: null
		});
	};

	return (
		<>
			<Navbar
				onOpenLogin={openLogin}
				onOpenRegister={openRegister}
				onOpenCart={() => setIsCartOpen(true)}
				onLogout={handleLogout}
			/>

			<Outlet />

			<LoginRegisterModal
				isOpen={isloginregisterOpen}
				onClose={() => setLoginRegisterOpen(false)}
				initialTab={loginregisterTab}
			/>

			<CartModal
				isOpen={isCartOpen}
				onClose={() => setIsCartOpen(false)}
			/>
		</>
	);
};