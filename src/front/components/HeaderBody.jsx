import React from "react";

export const HeaderBody = ({ onViewCollection }) => {
	return (
		<section className="hero">
			<div className="hero-left">
				<p className="hero-tag">Nueva colección — 2026</p>

				<h1 className="hero-title">
					Viste<br />
					lo que<br />
					<em>te define</em>
				</h1>

				<p className="hero-desc">
					Prendas diseñadas para quienes no siguen tendencias, las crean.
					Minimalismo, intención y estilo propio.
				</p>

				<div className="hero-cta-group">
					<button className="brand-btn-primary" onClick={onViewCollection}>
						Ver colección
					</button>
				</div>
			</div>

			<div className="hero-right">
				<div className="hero-img-container">
					<div className="hero-img-placeholder">
						<span>Imagen de marca</span>
					</div>
				</div>
			</div>
		</section>
	);
};