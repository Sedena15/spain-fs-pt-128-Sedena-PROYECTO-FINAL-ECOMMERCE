import React, { useEffect, useState } from "react"
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { CardCamisetasMediana } from "../components/CardCamisetasMediana.jsx";
import { getShirts } from "../../Services/BackendServices.js";
import { CartModal } from "../components/CartModal.jsx";
import { HeaderBody } from "../components/HeaderBody.jsx";


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
	
	<>
		<HeaderBody onViewCollection={() => window.scrollTo({ top: 800, behavior: "smooth" })} />

		<div className="container mt-5">
			<h1 className="mb-4">Camisetas</h1>

			<div className="row">
				{shirts.map((shirt) => (
					<CardCamisetasMediana key={shirt.id} shirt={shirt} />
				))}
			</div>
		</div>
	</>

	);
};