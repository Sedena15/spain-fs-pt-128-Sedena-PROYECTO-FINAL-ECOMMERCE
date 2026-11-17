import React, { useEffect, useId, useState } from "react";

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const ProfilePhotoField = ({ className, photo, onPhotoChange, currentImage, disabled }) => {
	const id = useId();
	const [preview, setPreview] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		if (!photo) {
			setPreview("");
			return;
		}
		const url = URL.createObjectURL(photo);
		setPreview(url);
		return () => URL.revokeObjectURL(url);
	}, [photo]);

	const handleChange = (event) => {
		const file = event.target.files[0] ?? null;
		if (file && (!PHOTO_TYPES.includes(file.type) || file.size > MAX_PHOTO_BYTES)) {
			event.target.value = "";
			onPhotoChange(null);
			setError("Elige una imagen JPG, PNG o WebP de hasta 5 MB.");
			return;
		}
		onPhotoChange(file);
		setError("");
	};

	return (
		<div className={className}>
			<label htmlFor={id}>Foto de perfil (opcional)</label>
			{(preview || currentImage) && (
				<img
					className="editprofile-photo"
					src={preview || currentImage}
					alt="Vista previa de la foto de perfil"
					width={96}
					height={96}
				/>
			)}
			<input
				id={id}
				type="file"
				accept="image/jpeg,image/png,image/webp"
				aria-describedby={`${id}-formats`}
				onChange={handleChange}
				disabled={disabled}
			/>
			<small id={`${id}-formats`}>JPG, PNG o WebP, hasta 5 MB.</small>
			{error && <p role="alert">{error}</p>}
		</div>
	);
};
