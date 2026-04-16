import React from "react";
import { Link } from "react-router-dom";

export const Success = () => {
	return (
		<section className="success-page">
			<div className="success-card">
				<p className="success-tag">Pedido completado</p>
				<h1 className="success-title">Compra realizada con éxito</h1>
				<p className="success-description">
					Tu pedido se ha procesado correctamente. Gracias por confiar en la marca.
				</p>

				<Link to="/" className="success-btn">
					Volver a la tienda
				</Link>
			</div>
		</section>
	);
};