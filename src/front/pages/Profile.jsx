import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { getUserById, deleteUser } from "../../Services/BackendServices.js";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Profile = () => {
	const { id } = useParams();
	const [user, setUser] = useState(null);
	const navigate = useNavigate();
	const { dispatch } = useGlobalReducer();

	const loadUser = async () => {
		const data = await getUserById(id);

		if (!data.error) {
			setUser(data);
		}
	};

	const handleDeleteAccount = async () => {
		const confirmed = window.confirm("¿Seguro que quieres borrar tu cuenta?");

		if (!confirmed) return;

		const data = await deleteUser(id);

		if (data.error) {
			alert("Error al borrar la cuenta");
			return;
		}

		localStorage.removeItem("user");

		dispatch({
			type: "set_user",
			payload: null
		});

		navigate("/");
	};

	useEffect(() => {
		loadUser();
	}, [id]);

	if (!user) {
		return <p className="text-center mt-5">Cargando perfil...</p>;
	}

	return (
		<section className="profile-page">
			<div className="profile-wrapper">
				<div className="profile-image-box">
					<img
						src={user.image || "https://i.pravatar.cc/250?img=32"}
						alt={user.username}
						className="profile-image"
					/>
				</div>

				<div className="profile-content">
					<p className="profile-tag">Cuenta</p>
					<h1 className="profile-title">{user.username}</h1>

					<div className="profile-info-grid">
						<div className="profile-info-item">
							<span className="profile-info-label">Nombre</span>
							<p>{user.firstname}</p>
						</div>

						<div className="profile-info-item">
							<span className="profile-info-label">Apellidos</span>
							<p>{user.lastname}</p>
						</div>

						<div className="profile-info-item profile-info-full">
							<span className="profile-info-label">Email</span>
							<p>{user.email}</p>
						</div>
					</div>

					<div className="profile-actions">
						<Link to={`/profile/${user.id}/edit`} className="profile-btn-dark">
							Editar perfil
						</Link>

						<button className="profile-btn-danger" onClick={handleDeleteAccount}>
							Borrar cuenta
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};