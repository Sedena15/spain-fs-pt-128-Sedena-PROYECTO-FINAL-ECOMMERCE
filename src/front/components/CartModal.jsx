import React, { useEffect, useState } from "react";
import { getCartByUserId,updateCartItem, deleteCartItem }  from "../../Services/BackendServices";


export const CartModal = ({ isOpen, onClose }) => {
	const [cart, setCart] = useState(null);

	const loadCart = async () => {
		const data = await getCartByUserId(1);

		if (!data.error) {
			setCart(data);
		}
	};
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

	useEffect(() => {
		if (isOpen) {
			loadCart();
		}
	}, [isOpen]);

	return (
		<>
			<div
				className={`cart-overlay ${isOpen ? "open" : ""}`}
				onClick={onClose}
			></div>

			<div className={`cart-panel ${isOpen ? "open" : ""}`}>
				<div className="d-flex justify-content-between align-items-center mb-4">
					<h2 className="m-0">Carrito</h2>
					<button className="btn btn-sm btn-dark" onClick={onClose}>
						X
					</button>
				</div>

				{cart && cart.items.length > 0 ? (
					cart.items.map((item) => (
						<div key={item.id} className="border-bottom pb-3 mb-3">
							<h5>{item.shirt_name}</h5>
							<p className="mb-1">Talla: {item.size}</p>
							<p className="mb-1">Precio: {item.price}€</p>
							<div className="d-flex align-items-center gap-2 mt-2">

	                        <button
		                        className="btn btn-outline-dark btn-sm"
		                            onClick={() => handleDecrease(item)}>
		                            -
	                        </button>

                        	<span>{item.quantity}</span>

	                            <button
		                            className="btn btn-outline-dark btn-sm"
		                                onClick={() => handleIncrease(item)}>
		                                +
	                            </button>

	                        <button
		                        className="btn btn-danger btn-sm ms-auto"
		                            onClick={() => handleDelete(item)}>
		                             X
	                        </button>

                            </div>
						</div>
					))
				) : (
					<p>El carrito está vacío.</p>
				)}
			</div>
		</>
	);
};