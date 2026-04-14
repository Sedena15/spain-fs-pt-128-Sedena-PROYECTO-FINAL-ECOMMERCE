import React, { useEffect, useState } from "react"
import { useParams} from "react-router-dom";
import { getShirtById, addToCart} from "../../Services/BackendServices";


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

		const data = await addToCart({
			user_id: 1,
			shirt_variant_id: selectedVariant.id,
			quantity: 1
		});

		console.log(data);
	};

	if (!shirt) {
		return <p className="text-center mt-5">Cargando...</p>;
	}

	return (
		<div className="container mt-5">
			<div className="row">
				<div className="col-md-6">
					<img
						src={shirt.image || "https://via.placeholder.com/400"}
						className="img-fluid"
						alt={shirt.name}
					/>
				</div>

				<div className="col-md-6">
					<h2>{shirt.name}</h2>
					<p>{shirt.description}</p>

					<h4 className="mt-3">Tallas:</h4>

					<div className="d-flex gap-2 flex-wrap mb-3">
						{shirt.variants?.map((variant) => (
							<button
								key={variant.id}
								className={`btn ${
									selectedVariant?.id === variant.id ? "btn-dark" : "btn-outline-dark"
								}`}
								onClick={() => setSelectedVariant(variant)}
							>
								{variant.size} - {variant.price}€
							</button>
						))}
					</div>

					<button className="btn btn-dark" onClick={handleAddToCart}>
						Añadir al carrito
					</button>
				</div>
			</div>
		</div>
	);
};