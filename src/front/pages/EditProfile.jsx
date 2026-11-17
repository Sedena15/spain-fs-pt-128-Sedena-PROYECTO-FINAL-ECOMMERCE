import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../Services/BackendServices.js";

import { ProfilePhotoField } from "../components/ProfilePhotoField.jsx";

export const EditProfile = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [formData, setFormData] = useState({
		username: "",
		firstname: "",
		lastname: "",
		email: "",
		password: "",
		image: ""
	});

	const [message, setMessage] = useState("");
	const [photo, setPhoto] = useState(null);
	const [isSaving, setIsSaving] = useState(false);

	const loadUser = async () => {
		const data = await getUserById(id);

		if (!data.error) {
			setFormData({
				username: data.username || "",
				firstname: data.firstname || "",
				lastname: data.lastname || "",
				email: data.email || "",
				password: "",
				image: data.image || ""
			});
		}
	};

	useEffect(() => {
		loadUser();
	}, [id]);

	const handleChange = (event) => {
		const { name, value } = event.target;

		setFormData({
			...formData,
			[name]: value
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (isSaving) return;

		const { username, firstname, lastname, email, password } = formData;
		const dataToSend = { username, firstname, lastname, email };
		if (password.trim()) dataToSend.password = password;

		let payload = dataToSend;
		if (photo) {
			payload = new FormData();
			for (const [name, value] of Object.entries(dataToSend)) {
				payload.append(name, value);
			}
			payload.append("photo", photo);
		}

		setMessage("");
		setIsSaving(true);
		try {
			const data = await updateUser(id, payload);
			if (data.error) {
				setMessage(data.data?.error || "Error al actualizar el perfil");
				return;
			}
			navigate(`/profile/${id}`);
		} catch {
			setMessage("No se pudo guardar el perfil. Inténtalo de nuevo.");
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<section className="profile-page">
			<div className="editprofile-wrapper">
				<div className="editprofile-header">
					<p className="profile-tag">Cuenta</p>
					<h1 className="profile-title">Editar perfil</h1>
				</div>

				<form onSubmit={handleSubmit} className="editprofile-form">
					<div className="editprofile-two-cols">
						<div className="editprofile-group">
							<label>Username</label>
							<input
								type="text"
								name="username"
								value={formData.username}
								onChange={handleChange}
							/>
						</div>

						<div className="editprofile-group">
							<label>Nombre</label>
							<input
								type="text"
								name="firstname"
								value={formData.firstname}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div className="editprofile-two-cols">
						<div className="editprofile-group">
							<label>Apellidos</label>
							<input
								type="text"
								name="lastname"
								value={formData.lastname}
								onChange={handleChange}
							/>
						</div>

						<div className="editprofile-group">
							<label>Email</label>
							<input
								type="email"
								name="email"
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div className="editprofile-group">
						<label>Nueva contraseña</label>
						<input
							type="password"
							name="password"
							value={formData.password}
							onChange={handleChange}
							placeholder="Déjalo vacío si no quieres cambiarla"
						/>
					</div>

					<ProfilePhotoField
						className="editprofile-group"
						photo={photo}
						onPhotoChange={setPhoto}
						currentImage={formData.image}
						disabled={isSaving}
					/>

					<div className="editprofile-actions">
						<button type="submit" className="profile-btn-dark" disabled={isSaving}>
							{isSaving ? "Guardando…" : "Guardar cambios"}
						</button>

						<button
							type="button"
							className="profile-btn-outline"
							onClick={() => navigate(`/profile/${id}`)}
						>
							Cancelar
						</button>
					</div>
				</form>

				{message && <p className="editprofile-message" role="alert">{message}</p>}
			</div>
		</section>
	);
};
