import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Home = () => {
	const [shirts, setShirts] = useState([]);

	const getShirts = async () => {
		try {
			const backendUrl = import.meta.env.VITE_BACKEND_URL;

			if (!backendUrl) {
				throw new Error("VITE_BACKEND_URL is not defined in .env file");
			}

			const response = await fetch(`${backendUrl}/api/shirts`);
			const data = await response.json();

			console.log(data);
			setShirts(data);
		} catch (error) {
			console.log("Error loading shirts:", error);
		}
	};

	useEffect(() => {
		getShirts();
	}, []);

return (
	<div className="container mt-5">
		<h1 className="mb-4">Camisetas</h1>

		<div className="row">
			{shirts.map((shirt) => (
				<div key={shirt.id} className="col-md-4 mb-4">
					<div className="card h-100 shadow-sm">
						
						<img
							src={shirt.image}
							className="card-img-top"
							alt={shirt.name}
							style={{ objectFit: "cover", height: "250px" }}
						/>

						<div className="card-body d-flex flex-column">
							<h5 className="card-title">{shirt.name}</h5>
							<p className="card-text">{shirt.description}</p>

							<button className="btn btn-dark mt-auto">
								Ver producto
							</button>
						</div>

					</div>
				</div>
			))}
		</div>
	</div>
);
};