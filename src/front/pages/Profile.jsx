import React from "react";
import { useParams, Link } from "react-router-dom";

export const Profile = () => {
	const { id } = useParams();

	return (
		<div className="container mt-5">
			<h1>Mi perfil</h1>
			<p>ID del usuario: {id}</p>

			<Link to={`/profile/${id}/edit`} className="btn btn-dark">
				Editar perfil
			</Link>
		</div>
	);
};