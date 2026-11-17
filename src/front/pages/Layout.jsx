import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar.jsx";
import { LoginRegisterModal } from "../components/LoginRegisterModal.jsx";
import { CartModal } from "../components/CartModal.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { getUserById } from "../../Services/BackendServices.js";
import { Footer } from "../components/Footer.jsx";

export const Layout = () => {
	const { dispatch } = useGlobalReducer();

	const [isLoginRegisterOpen, setLoginRegisterOpen] = useState(false);
	const [loginregisterTab, setLoginRegisterTab] = useState("login");
	const [isCartOpen, setIsCartOpen] = useState(false);
	const [isRestoringSession, setIsRestoringSession] = useState(true);

	useEffect(() => {
		const controller = new AbortController();
		const token = localStorage.getItem("token");

		const clearSavedSession = () => {
			localStorage.removeItem("user");
			localStorage.removeItem("token");
		};

		const restoreSession = async () => {
			try {
				const savedUser = JSON.parse(localStorage.getItem("user"));
				if (!token || !savedUser?.id) {
					clearSavedSession();
					return;
				}

				const user = await getUserById(savedUser.id, controller.signal);
				if (controller.signal.aborted || localStorage.getItem("token") !== token) return;

				if (!user.error) {
					localStorage.setItem("user", JSON.stringify(user));
					dispatch({ type: "set_user", payload: user });
				} else if ([401, 403, 404, 422].includes(user.status)) {
					clearSavedSession();
				}
			} catch (error) {
				if (error instanceof SyntaxError && localStorage.getItem("token") === token) {
					clearSavedSession();
				}
			} finally {
				if (!controller.signal.aborted) setIsRestoringSession(false);
			}
		};

		restoreSession();
		return () => controller.abort();
	}, [dispatch]);

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
		localStorage.removeItem("token");

		dispatch({
			type: "set_user",
			payload: null
		});
	};

	return (
	<div className="site-shell">
		<Navbar
			onOpenLogin={openLogin}
			onOpenRegister={openRegister}
			onOpenCart={() => setIsCartOpen(true)}
			onLogout={handleLogout}
		/>

		<main className="site-main">
			<Outlet context={{ isRestoringSession }} />
		</main>

		<Footer
			onOpenLogin={openLogin}
			onOpenRegister={openRegister}
		/>

		<LoginRegisterModal
			isOpen={isLoginRegisterOpen}
			onClose={() => setLoginRegisterOpen(false)}
			initialTab={loginregisterTab}
		/>

		<CartModal
			isOpen={isCartOpen}
			onClose={() => setIsCartOpen(false)}
		/>
	</div>
);
};
