import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getShirtById, addToCart } from "../../Services/BackendServices.js";

export const ProductDetail = () => {
	const { id } = useParams();
	const [shirt, setShirt] = useState(null);
	const [selectedVariant, setSelectedVariant] = useState(null);

	const loadShirt = async () => {
		const data = await getShirtById(id);

		if (!data.error) {
			setShirt(data);

			if (data.variants && data.variants.length > 0) {
				setSelectedVariant(data.variants[0]);
			}
		}
	};

	useEffect(() => {
		loadShirt();
	}, [id]);

	const handleAddToCart = async () => {
		if (!selectedVariant) return;

		const savedUser = JSON.parse(localStorage.getItem("user"));

		if (!savedUser) {
			alert("Debes iniciar sesión para añadir productos al carrito");
			return;
		}

		const data = await addToCart({
			user_id: savedUser.id,
			shirt_variant_id: selectedVariant.id,
			quantity: 1
		});

		console.log(data);
	};

	if (!shirt) {
		return <p className="text-center mt-5">Cargando...</p>;
	}

	return (
		<section className="detail-page">
			<div className="detail-back-wrapper">
				<button className="detail-back-btn" onClick={() => window.history.back()}>
					← Volver
				</button>
			</div>

			<div className="detail-layout">
				<div className="detail-image-side">
					<img
						src={shirt.image || "https://i.pravatar.cc/500?img=20"}
						alt={shirt.name}
						className="detail-image"
					/>
				</div>

				<div className="detail-info-side">
					<p className="detail-label">Camiseta</p>
					<h1 className="detail-title">{shirt.name}</h1>
					<p className="detail-description">{shirt.description}</p>

					<div className="detail-price-block">
						<span className="detail-price">
							{selectedVariant ? `${selectedVariant.price}€` : "Sin precio"}
						</span>
					</div>

					<div className="detail-size-section">
						<p className="detail-size-label">Talla</p>

						<div className="detail-size-options">
							{shirt.variants?.map((variant) => (
								<button
									key={variant.id}
									className={`detail-size-btn ${
										selectedVariant?.id === variant.id ? "active" : ""
									}`}
									onClick={() => setSelectedVariant(variant)}
								>
									{variant.size}
								</button>
							))}
						</div>
					</div>

					<button className="detail-add-btn" onClick={handleAddToCart}>
						Añadir al carrito
					</button>
				</div>
			</div>
		</section>
	);
};