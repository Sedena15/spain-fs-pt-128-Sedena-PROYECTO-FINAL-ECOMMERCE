import React from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = ({ onOpenLogin, onOpenRegister, onOpenCart, onLogout }) => {
	const { store } = useGlobalReducer();

	return (
		<nav className="navbar-pro">
			<Link className="nav-logo" to="/">
				MARCA
			</Link>

			<div className="nav-actions">
				{store.user ? (
					<>
						<Link className="btn-outline" to={`/profile/${store.user.id}`}>
							Mi perfil
						</Link>

						<button className="btn-dark" onClick={onLogout}>
							Cerrar sesión
						</button>
					</>
				) : (
					<>
						<button className="btn-outline" onClick={onOpenLogin}>
							Iniciar sesión
						</button>

						<button className="btn-dark" onClick={onOpenRegister}>
							Registrarse
						</button>
					</>
				)}

				<button className="btn-cart" onClick={onOpenCart}>
					Carrito
				</button>
			</div>
		</nav>
	);
};