import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	getCartByUserId,
	updateCartItem,
	deleteCartItem
} from "../../Services/BackendServices.js";

export const CartModal = ({ isOpen, onClose }) => {
	const [cart, setCart] = useState(null);
	const navigate = useNavigate();

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
		if (isOpen) {
			loadCart();
		}
	}, [isOpen]);

	const handleIncrease = async (item) => {
		await updateCartItem(item.id, {
			quantity: item.quantity + 1
		});
		loadCart();
	};

	const handleDecrease = async (item) => {
		if (item.quantity > 1) {
			await updateCartItem(item.id, {
				quantity: item.quantity - 1
			});
			loadCart();
		}
	};

	const handleDelete = async (item) => {
		await deleteCartItem(item.id);
		loadCart();
	};

	const total =
		cart?.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

	if (!isOpen) return null;

	return (
		<>
			<div className="cartpro-overlay" onClick={onClose}></div>

			<aside className="cartpro-panel">
				<div className="cartpro-header">
					<div>
						<p className="cartpro-tag">Tu selección</p>
						<h2 className="cartpro-title">Carrito</h2>
					</div>

					<button className="cartpro-close-btn" onClick={onClose}>
						×
					</button>
				</div>

				<div className="cartpro-body">
					{cart && cart.items.length > 0 ? (
						cart.items.map((item) => (
							<div key={item.id} className="cartpro-item">
								<img
									src={item.image || "https://i.pravatar.cc/200?img=22"}
									alt={item.shirt_name}
									className="cartpro-item-image"
								/>

								<div className="cartpro-item-info">
									<h4 className="cartpro-item-name">{item.shirt_name}</h4>
									<p className="cartpro-item-meta">Talla: {item.size}</p>
									<p className="cartpro-item-price">{item.price}€</p>

									<div className="cartpro-actions">
										<div className="cartpro-qty">
											<button onClick={() => handleDecrease(item)}>-</button>
											<span>{item.quantity}</span>
											<button onClick={() => handleIncrease(item)}>+</button>
										</div>

										<button
											className="cartpro-delete-btn"
											onClick={() => handleDelete(item)}
										>
											Eliminar
										</button>
									</div>
								</div>
							</div>
						))
					) : (
						<p className="cartpro-empty">Tu carrito está vacío.</p>
					)}
				</div>

				<div className="cartpro-footer">
					<div className="cartpro-total">
						<span>Total</span>
						<strong>{total}€</strong>
					</div>

					<button
						className="cartpro-checkout-btn"
						onClick={() => {
							onClose();
							navigate("/checkout");
						}}
						disabled={!cart || cart.items.length === 0}
					>
						Ir al pago
					</button>
				</div>
			</aside>
		</>
	);
};