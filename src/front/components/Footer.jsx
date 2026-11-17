import React from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Footer = ({ onOpenLogin, onOpenRegister }) => {
	const { store } = useGlobalReducer();

	return (
		<footer className="footer-pro">
			<div className="footer-pro-grid">
				<div className="footer-pro-brand">
					<Link className="footer-pro-logo" to="/">
						ELEGACY
					</Link>
					<p>
						Moda consciente para quienes eligen con intención.
						Cada prenda, una decisión.
					</p>
				</div>

				<div className="footer-pro-col">
					<h4>Cuenta</h4>
					<ul>
						{store.user ? (
							<>
								<li>
									<Link to={`/profile/${store.user.id}`}>Mi perfil</Link>
								</li>
							</>
						) : (
							<>
								<li>
									<button className="footer-link-btn" onClick={onOpenLogin}>
										Iniciar sesión
									</button>
								</li>
								<li>
									<button className="footer-link-btn" onClick={onOpenRegister}>
										Registrarse
									</button>
								</li>
							</>
						)}
					</ul>
				</div>

				<div className="footer-pro-col">
					<h4>Tienda</h4>
					<ul>
						<li><Link to="/">Colección</Link></li>
						
					</ul>
				</div>
			</div>

			<div className="footer-pro-bottom">
				<span>© 2026 ELEGACY. Todos los derechos reservados.</span>
				<span>Hecho con intención · España</span>
			</div>
		</footer>
	);
};
