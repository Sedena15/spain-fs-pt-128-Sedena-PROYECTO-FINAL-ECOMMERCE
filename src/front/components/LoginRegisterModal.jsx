import React, { useState, useEffect } from "react";
import { registerUser, loginUser } from "../../Services/BackendServices.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const LoginRegisterModal = ({ isOpen, onClose, initialTab }) => {
	const [activeTab, setActiveTab] = useState(initialTab);
	const { dispatch } = useGlobalReducer();

	const [loginData, setLoginData] = useState({
		email: "",
		password: ""
	});

	const [registerData, setRegisterData] = useState({
		username: "",
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		image: ""
	});

	const [message, setMessage] = useState("");

	useEffect(() => {
		if (isOpen) {
			setActiveTab(initialTab);
			setMessage("");
		}
	}, [initialTab, isOpen]);

	const handleLoginChange = (event) => {
		const { name, value } = event.target;
		setLoginData({
			...loginData,
			[name]: value
		});
	};

	const handleRegisterChange = (event) => {
		const { name, value } = event.target;
		setRegisterData({
			...registerData,
			[name]: value
		});
	};

	const handleRegisterSubmit = async (event) => {
	event.preventDefault();

	const data = await registerUser(registerData);

	if (data.error) {
		setMessage(data.data?.error || "Error al registrarse");
		return;
	}

	localStorage.setItem("user", JSON.stringify(data.user));
	localStorage.setItem("token", data.token);

	dispatch({
		type: "set_user",
		payload: data.user
	});

	setMessage("Usuario registrado correctamente");
	onClose();
};

	const handleLoginSubmit = async (event) => {
		event.preventDefault();

		const data = await loginUser(loginData);

		if (data?.error) {
			setMessage("Error al iniciar sesión");
			return;
		}

		localStorage.setItem("user", JSON.stringify(data.user));
		localStorage.setItem("token", data.token);

		dispatch({
			type: "set_user",
			payload: data.user
		});

		setMessage("Inicio de sesión correcto");
		onClose();
	};

	if (!isOpen) return null;

	return (
		<>
			<div className="loginregister-overlay" onClick={onClose}></div>

			<div className="loginregister-modal">
				<button className="loginregister-close-btn" onClick={onClose}>
					×
				</button>

				<div className="loginregister-header">
					<p className="loginregister-tag">Cuenta</p>
					<h2 className="loginregister-title">
						{activeTab === "login" ? "Bienvenido de nuevo" : "Crea tu cuenta"}
					</h2>
				</div>

				<div className="loginregister-tabs">
					<button
						className={`loginregister-tab ${activeTab === "login" ? "active" : ""}`}
						onClick={() => {
							setActiveTab("login");
							setMessage("");
						}}
					>
						Iniciar sesión
					</button>

					<button
						className={`loginregister-tab ${activeTab === "register" ? "active" : ""}`}
						onClick={() => {
							setActiveTab("register");
							setMessage("");
						}}
					>
						Registrarse
					</button>
				</div>

				{activeTab === "login" ? (
					<form onSubmit={handleLoginSubmit} className="loginregister-form">
						<div className="loginregister-group">
							<label>Email</label>
							<input
								type="email"
								name="email"
								value={loginData.email}
								onChange={handleLoginChange}
								placeholder="hola@correo.com"
							/>
						</div>

						<div className="loginregister-group">
							<label>Contraseña</label>
							<input
								type="password"
								name="password"
								value={loginData.password}
								onChange={handleLoginChange}
								placeholder="••••••••"
							/>
						</div>

						<button type="submit" className="loginregister-submit-btn">
							Entrar
						</button>
					</form>
				) : (
					<form onSubmit={handleRegisterSubmit} className="loginregister-form">
						<div className="loginregister-two-cols">
							<div className="loginregister-group">
								<label>Nombre</label>
								<input
									type="text"
									name="firstname"
									value={registerData.firstname}
									onChange={handleRegisterChange}
									placeholder="Ana"
								/>
							</div>

							<div className="loginregister-group">
								<label>Apellidos</label>
								<input
									type="text"
									name="lastname"
									value={registerData.lastname}
									onChange={handleRegisterChange}
									placeholder="García"
								/>
							</div>
						</div>

						<div className="loginregister-group">
							<label>Username</label>
							<input
								type="text"
								name="username"
								value={registerData.username}
								onChange={handleRegisterChange}
								placeholder="tu_usuario"
							/>
						</div>

						<div className="loginregister-group">
							<label>Email</label>
							<input
								type="email"
								name="email"
								value={registerData.email}
								onChange={handleRegisterChange}
								placeholder="hola@correo.com"
							/>
						</div>

						<div className="loginregister-group">
							<label>Contraseña</label>
							<input
								type="password"
								name="password"
								value={registerData.password}
								onChange={handleRegisterChange}
								placeholder="••••••••"
							/>
						</div>

						<div className="loginregister-group">
							<label>Imagen</label>
							<input
								type="text"
								name="image"
								value={registerData.image}
								onChange={handleRegisterChange}
								placeholder="URL de la imagen"
							/>
						</div>

						<button type="submit" className="loginregister-submit-btn">
							Crear cuenta
						</button>
					</form>
				)}

				{message && <p className="loginregister-message">{message}</p>}
			</div>
		</>
	);
};