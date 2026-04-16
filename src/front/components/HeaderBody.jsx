import React from "react";

export const HeaderBody = ({ onViewCollection }) => {
	return (
		<section className="HeaderBody">
			<div className="HeaderBody-left">
				<p className="HeaderBody-tag">Nueva colección — 2026</p>

				<h1 className="HeaderBody-title">
					Viste<br />lo que<br /><em>te define</em>
				</h1>

				<p className="HeaderBody-desc">
					Prendas diseñadas para quienes no siguen tendencias,
					las crean. Minimalismo, intención y estilo propio.
				</p>

				<div className="HeaderBody-cta">
					<button className="btn-primary" onClick={onViewCollection}>
						Ver colección
					</button>
				</div>
			</div>

			<div className="HeaderBody-right">
				<div className="HeaderBody-img-placeholder">
					<span>Imagen marca</span>
				</div>
			</div>
		</section>
	);
};