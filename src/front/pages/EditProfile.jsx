import React from "react";
import { useParams } from "react-router-dom";

export const EditProfile = () => {
	const { id } = useParams();

	return (
		<div className="container mt-5">
			<h1>Editar perfil</h1>
			<p>Editando usuario: {id}</p>
		</div>
	);
};