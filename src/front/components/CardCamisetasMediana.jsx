import React from "react";
import { useNavigate } from "react-router-dom";

export const CardCamisetasMediana = ({ shirt }) => {
	const navigate = useNavigate();

	return (
		<div className="col-md-4 mb-4">
			<div className="card h-100 shadow-sm">
				<img
					src={shirt.image || "https://via.placeholder.com/300"}
					className="card-img-top"
					alt={shirt.name}
					style={{ objectFit: "cover", height: "250px" }}
				/>

				<div className="card-body d-flex flex-column">
					<h5 className="card-title">{shirt.name}</h5>
					<p className="card-text">{shirt.description}</p>

					<button
						className="btn btn-dark mt-auto"
						onClick={() => navigate(`/product/${shirt.id}`)}
					>
						Ver producto
					</button>
				</div>
			</div>
		</div>
	);
};