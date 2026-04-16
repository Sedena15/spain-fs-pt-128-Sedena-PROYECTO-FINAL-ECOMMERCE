import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCartByUserId, deleteCartItem } from "../../Services/BackendServices.js";

export const Checkout = () => {
	const navigate = useNavigate();
	const [cart, setCart] = useState(null);

	const loadCart = async () => {
		const savedUser = JSON.parse(localStorage.getItem("user"));

		if (!savedUser) {
			setCart({ items: [] });
			return;
		}

		const data = await getCartByUserId(savedUser.id);

		if (!data.error) {
			setCart(data);
		}
	};

	useEffect(() => {
		loadCart();
	}, []);

	const handlePayment = async () => {
		if (cart && cart.items.length > 0) {
			for (const item of cart.items) {
				await deleteCartItem(item.id);
			}
		}

		navigate("/success");
	};

	const total =
		cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

	return (
		<section className="checkout-page">
			<div className="checkout-wrapper">
				<div className="checkout-left">
					<p className="checkout-tag">Finalizar compra</p>
					<h1 className="checkout-title">Resumen del pedido</h1>
					<p className="checkout-description">
						Revisa tu pedido antes de completar la compra.
					</p>

					<div className="checkout-items">
						{cart && cart.items.length > 0 ? (
							cart.items.map((item) => (
								<div key={item.id} className="checkout-item">
									<img
										src={item.image || "https://i.pravatar.cc/200?img=18"}
										alt={item.shirt_name}
										className="checkout-item-image"
									/>

									<div className="checkout-item-info">
										<h4>{item.shirt_name}</h4>
										<p>Talla: {item.size}</p>
										<p>Cantidad: {item.quantity}</p>
										<p>{item.price}€</p>
									</div>
								</div>
							))
						) : (
							<p className="checkout-empty">Tu carrito está vacío.</p>
						)}
					</div>
				</div>

				<div className="checkout-right">
					<div className="checkout-summary-card">
						<p className="checkout-summary-label">Total</p>
						<h2 className="checkout-total">{total}€</h2>

						<p className="checkout-note">
							Este es un simulacro de pago. Más adelante podrás conectarlo con Stripe.
						</p>

						<button
							className="checkout-pay-btn"
							onClick={handlePayment}
							disabled={!cart || cart.items.length === 0}
						>
							Pagar pedido
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};