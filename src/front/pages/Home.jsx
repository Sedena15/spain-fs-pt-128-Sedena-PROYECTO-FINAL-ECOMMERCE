import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { CardCamisetasMediana } from "../components/CardCamisetasMediana.jsx";
import { getShirts } from "../../Services/BackendServices.js";
import { CartModal } from "../components/CartModal.jsx";


export const Home = () => {
	const [shirts, setShirts] = useState([]);
	const [isCartOpen, setIsCartOpen] = useState(false);

	const loadShirts = async () => {
		const data = await getShirts();

		if (!data.error) {
			setShirts(data);
		}
	};

	useEffect(() => {
		loadShirts();
	}, []);

	return (
		<div className="container mt-5">
			<div className="d-flex justify-content-between align-items-center mb-4">
				<h1 className="mb-0">Camisetas</h1>
				<button className="btn btn-dark" onClick={() => setIsCartOpen(true)}>
					Ver carrito
				</button>
			</div>

			<div className="row">
				{shirts.map((shirt) => (
					<CardCamisetasMediana key={shirt.id} shirt={shirt} />
				))}
			</div>

			<CartModal
				isOpen={isCartOpen}
				onClose={() => setIsCartOpen(false)}
			/>
		</div>
	);
};