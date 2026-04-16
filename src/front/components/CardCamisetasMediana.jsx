import React from "react";
import { useNavigate } from "react-router-dom";

export const CardCamisetasMediana = ({ shirt }) => {
	const navigate = useNavigate();

	return (
		<div className="product-col">
			<div className="product-card" onClick={() => navigate(`/product/${shirt.id}`)}>
				<div className="product-image-wrapper">
					<img
						src={shirt.image || "https://i.pravatar.cc/400?img=12"}
						alt={shirt.name}
						className="product-image"
					/>
				</div>

				<div className="product-info">
					<h3 className="product-name">{shirt.name}</h3>
					<p className="product-description">{shirt.description}</p>

					<button
						className="product-button"
						onClick={(e) => {
							e.stopPropagation();
							navigate(`/product/${shirt.id}`);
						}}
					>
						Ver producto
					</button>
				</div>
			</div>
		</div>
	);
};