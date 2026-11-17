const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");

const getAuthHeaders = () => {
	const token = localStorage.getItem("token");

	return token
		? {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`
		  }
		: {
				"Content-Type": "application/json"
		  };
};

// ---------------------
// SHIRTS
// ---------------------

export const getShirts = async () => {
	const response = await fetch(`${BACKEND_URL}/api/shirts`);

	const data = await response.json();

	if (!response.ok) {
		return { error: true, data };
	}

	return data;
};

export const getShirtById = async (shirtId) => {
	const response = await fetch(`${BACKEND_URL}/api/shirts/${shirtId}`);

	const data = await response.json();

	if (!response.ok) {
		return { error: true, data };
	}

	return data;
};

// ---------------------
// USER
// ---------------------

export const registerUser = async (user) => {
	const response = await fetch(`${BACKEND_URL}/api/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	});

	const data = await response.json();

	if (!response.ok) {
		return { error: true, data };
	}

	return data;
};

export const getUserById = async (userId, signal) => {
	const response = await fetch(`${BACKEND_URL}/api/users/${userId}`, {
		method: "GET",
		headers: getAuthHeaders(),
		signal
	});

	const data = await response.json();

	if (!response.ok) {
		return { error: true, status: response.status, data };
	}

	return data;
};

export const updateUser = async (userId, updatedData) => {
	const response = await fetch(`${BACKEND_URL}/api/users/${userId}`, {
		method: "PUT",
		headers: getAuthHeaders(),
		body: JSON.stringify(updatedData)
	});

	const data = await response.json();

	if (!response.ok) {
		return { error: true, data };
	}

	return data;
};

export const deleteUser = async (userId) => {
	const response = await fetch(`${BACKEND_URL}/api/users/${userId}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	});

	const data = await response.json();

	if (!response.ok) {
		return { error: true, data };
	}

	return data;
};


// ---------------------
// LOGIN
// ---------------------

export const loginUser = async (user) => {
	const response = await fetch(`${BACKEND_URL}/api/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	});

	const data = await response.json();

	if (!response.ok) {
		return { error: true, data };
	}

	return data;
};


// ---------------------
// CART
// ---------------------

export const getCartByUserId = async (userId) => {
	const response = await fetch(`${BACKEND_URL}/api/cart/${userId}`, {
		method: "GET",
		headers: getAuthHeaders()
	});

	const data = await response.json();

	if (!response.ok) {
		return { error: true, data };
	}

	return data;
};

export const addToCart = async (cartData) => {
	const response = await fetch(`${BACKEND_URL}/api/cart/items`, {
		method: "POST",
		headers: getAuthHeaders(),
		body: JSON.stringify(cartData)
	});

	const data = await response.json();

	if (!response.ok) {
		return { error: true, data };
	}

	return data;
};

export const updateCartItem = async (itemId, updatedData) => {
	const response = await fetch(`${BACKEND_URL}/api/cart/items/${itemId}`, {
		method: "PUT",
		headers: getAuthHeaders(),
		body: JSON.stringify(updatedData)
	});

	const data = await response.json();

	if (!response.ok) {
		return { error: true, data };
	}

	return data;
};

export const deleteCartItem = async (itemId) => {
	const response = await fetch(`${BACKEND_URL}/api/cart/items/${itemId}`, {
		method: "DELETE",
		headers: getAuthHeaders()
	});

	const data = await response.json();

	if (!response.ok) {
		return { error: true, data };
	}

	return data;
};

export const createCheckoutSession = async (userId) => {
	const response = await fetch(`${BACKEND_URL}/api/create-checkout-session/${userId}`, {
		method: "POST",
		headers: getAuthHeaders()
	});

	const data = await response.json();

	if (!response.ok) {
		return { error: true, data };
	}

	return data;
};

export const getRecommendationAvailability = async () => {
	const response = await fetch(`${BACKEND_URL}/api/recommendations`);
	if (!response.ok) return false;
	const data = await response.json();
	return data.enabled === true;
};

export const searchRecommendations = async (query) => {
	const response = await fetch(`${BACKEND_URL}/api/recommendations`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ query })
	});
	const data = await response.json();
	if (!response.ok) throw new Error(data.error || "No se pudo completar la búsqueda.");
	return data.products;
};
