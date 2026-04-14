import React from "react";
import { useNavigate } from "react-router-dom";

export const CheckOut = () => {
	const navigate = useNavigate();

	return (
		<div className="container mt-5">
			<h1>CheckOut</h1>
			<p>Aquí irá el simulacro de pago.</p>

			<button className="btn btn-success" onClick={() => navigate("/success")}>
				Pagar
			</button>
		</div>
	);
};