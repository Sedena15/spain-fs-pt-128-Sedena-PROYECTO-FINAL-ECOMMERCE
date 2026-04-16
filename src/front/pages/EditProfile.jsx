import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserById, updateUser } from "../../Services/BackendServices.js";

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

		const dataToSend = {
			username: formData.username,
			firstname: formData.firstname,
			lastname: formData.lastname,
			email: formData.email,
			image: formData.image
		};

		if (formData.password.trim() !== "") {
			dataToSend.password = formData.password;
		}

		const data = await updateUser(id, dataToSend);

		if (data.error) {
			setMessage("Error al actualizar el perfil");
			return;
		}

		setMessage("Perfil actualizado correctamente");

		setTimeout(() => {
			navigate(`/profile/${id}`);
		}, 900);
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

					<div className="editprofile-group">
						<label>Imagen</label>
						<input
							type="text"
							name="image"
							value={formData.image}
							onChange={handleChange}
							placeholder="URL de la imagen"
						/>
					</div>

					<div className="editprofile-actions">
						<button type="submit" className="profile-btn-dark">
							Guardar cambios
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

				{message && <p className="editprofile-message">{message}</p>}
			</div>
		</section>
	);
};