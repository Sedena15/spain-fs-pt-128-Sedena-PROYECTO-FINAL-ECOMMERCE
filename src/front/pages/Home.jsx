import React, { useEffect, useState, useRef } from "react";
import { CardCamisetasMediana } from "../components/CardCamisetasMediana.jsx";
import { HeaderBody } from "../components/HeaderBody.jsx";
import { BannerSection } from "../components/BannerSection.jsx";
import { getShirts, getRecommendationAvailability, searchRecommendations } from "../../Services/BackendServices.js";

export const Home = () => {
	const [shirts, setShirts] = useState([]);
	const [isSearchEnabled, setIsSearchEnabled] = useState(false);
	const [query, setQuery] = useState("");
	const [recommendations, setRecommendations] = useState(null);
	const [searchError, setSearchError] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const productsRef = useRef(null);

	const loadShirts = async () => {
		const data = await getShirts();

		if (!data.error) {
			setShirts(data);
		}
	};

	useEffect(() => {
		loadShirts();
		getRecommendationAvailability().then(setIsSearchEnabled).catch(() => {});
	}, []);

	const handleSearch = async (event) => {
		event.preventDefault();
		if (!query.trim() || isSearching) return;

		setSearchError("");
		setIsSearching(true);
		try {
			setRecommendations(await searchRecommendations(query.trim()));
		} catch (error) {
			setRecommendations(null);
			setSearchError(error.message);
		} finally {
			setIsSearching(false);
		}
	};

	const resetSearch = () => {
		setQuery("");
		setRecommendations(null);
		setSearchError("");
	};

	const scrollToCollection = () => {
		if (productsRef.current) {
			productsRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<>
			<HeaderBody onViewCollection={scrollToCollection} />

			<section ref={productsRef} className="products-section">
				<div className="products-header">
					<div>
						<p className="section-label">Colección</p>
						<h2 className="section-title">Nuestras camisetas</h2>
					</div>
				</div>

				{isSearchEnabled && (
					<form className="catalog-search" onSubmit={handleSearch}>
						<label htmlFor="catalog-query">Busca camisetas con IA</label>
						<div className="catalog-search-actions">
							<input
								id="catalog-query"
								type="search"
								placeholder="Negra, talla M, por menos de 30 €"
								maxLength={250}
								value={query}
								onChange={(event) => setQuery(event.target.value)}
								required
							/>
							<button className="btn-dark" type="submit" disabled={isSearching || !query.trim()}>
								Buscar
							</button>
							{recommendations !== null && (
								<button className="btn-outline" type="button" onClick={resetSearch} disabled={isSearching}>
									Ver toda la colección
								</button>
							)}
						</div>
						{searchError && <p role="alert">{searchError}</p>}
						<div role="status">
							{isSearching && "Buscando camisetas…"}
							{!isSearching && recommendations?.length === 0 && "No hay camisetas disponibles que coincidan."}
							{!isSearching && recommendations?.length > 0 && `${recommendations.length} recomendaciones`}
						</div>
					</form>
				)}

				<div className="products-grid">
					{(recommendations ?? shirts).map((shirt) => (
						<CardCamisetasMediana key={shirt.id} shirt={shirt} />
					))}
				</div>
			</section>

			<BannerSection />
		</>
	);
};
