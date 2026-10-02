"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import request, jsonify, Blueprint
from api.models import db, User, Shirt, Cart, CartItem, ShirtVariant
import os
import stripe
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from seed_shirts import seed_shirts

api = Blueprint('api', __name__)

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")



@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    current_user_id = get_jwt_identity()

    if int(current_user_id) != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify(user.serialize()), 200

@api.route("/users", methods=["POST"])
def create_user():
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    username = data.get("username")
    firstname = data.get("firstname")
    lastname = data.get("lastname")
    email = data.get("email")
    password = data.get("password")
    image = data.get("image")

    if not username or not firstname or not lastname or not email or not password:
        return jsonify({"error": "username, firstname, lastname, email and password are required"}), 400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email already exists"}), 400
    
    new_user = User(
        username=username,
        firstname=firstname,
        lastname=lastname,
        email=email,
        image=image
    )

    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

  
    access_token = create_access_token(identity=str(new_user.id))

    return jsonify({
        "message": "User created successfully",
        "token": access_token,   
        "user": new_user.serialize()
    }), 201


@api.route("/users/<int:user_id>", methods=["PUT"])
@jwt_required()
def update_user(user_id):
    current_user_id = get_jwt_identity()

    if int(current_user_id) != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    new_email = data.get("email")
    if new_email and new_email != user.email:
        existing_user = User.query.filter_by(email=new_email).first()
        if existing_user:
            return jsonify({"error": "Email already exists"}), 400

    user.username = data.get("username", user.username)
    user.firstname = data.get("firstname", user.firstname)
    user.lastname = data.get("lastname", user.lastname)
    user.email = data.get("email", user.email)
    user.image = data.get("image", user.image)

    new_password = data.get("password")
    if new_password:
        user.set_password(new_password)

    db.session.commit()

    return jsonify({
        "message": "User updated successfully",
        "user": user.serialize()
    }), 200
@api.route("/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    current_user_id = get_jwt_identity()

    if int(current_user_id) != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    cart = Cart.query.filter_by(user_id=user_id).first()

    if cart:
        cart_items = CartItem.query.filter_by(cart_id=cart.id).all()

        for item in cart_items:
            db.session.delete(item)

        db.session.delete(cart)

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200

@api.route("/login", methods=["POST"])
def login():
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid credentials"}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "user": user.serialize()
    }), 200


@api.route("/shirts", methods=["GET"])
def get_shirts():
    seed_shirts()
    shirts = Shirt.query.all()
    return jsonify([shirt.serialize() for shirt in shirts]), 200


@api.route("/shirts/<int:shirt_id>", methods=["GET"])
def get_shirt(shirt_id):
    shirt = Shirt.query.get(shirt_id)

    if shirt:
        return jsonify(shirt.serialize()), 200

    return jsonify({"error": "Shirt not found"}), 404


@api.route("/cart/<int:user_id>", methods=["GET"])
@jwt_required()
def get_cart(user_id):
    current_user_id = get_jwt_identity()

    if int(current_user_id) != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return jsonify({"error": "Cart not found"}), 404

    return jsonify(cart.serialize()), 200


@api.route("/cart/items", methods=["POST"])
@jwt_required()
def add_to_cart():
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    current_user_id = int(get_jwt_identity())

    user_id = data.get("user_id")
    variant_id = data.get("shirt_variant_id")
    quantity = data.get("quantity", 1)

    if not user_id or not variant_id:
        return jsonify({"error": "user_id and shirt_variant_id are required"}), 400

    if current_user_id != int(user_id):
        return jsonify({"error": "Unauthorized"}), 403

    variant = ShirtVariant.query.get(variant_id)
    if not variant:
        return jsonify({"error": "Shirt variant not found"}), 404

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        cart = Cart(user_id=user_id)
        db.session.add(cart)
        db.session.commit()

    existing_item = CartItem.query.filter_by(
        cart_id=cart.id,
        shirt_variant_id=variant_id
    ).first()

    if existing_item:
        existing_item.quantity += quantity
    else:
        new_item = CartItem(
            cart_id=cart.id,
            shirt_variant_id=variant_id,
            quantity=quantity
        )
        db.session.add(new_item)

    db.session.commit()

    return jsonify({"message": "Item added to the cart"}), 200


@api.route("/cart/items/<int:item_id>", methods=["PUT"])
@jwt_required()
def update_cart_item(item_id):
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    quantity = data.get("quantity")

    if quantity is None:
        return jsonify({"error": "Quantity is required"}), 400

    item = CartItem.query.get(item_id)

    if not item:
        return jsonify({"error": "Item not found"}), 404

    current_user_id = int(get_jwt_identity())

    if item.cart.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403

    if quantity < 1:
        return jsonify({"error": "Quantity must be at least 1"}), 400

    item.quantity = quantity
    db.session.commit()

    return jsonify({
        "message": "Cart item updated",
        "item": item.serialize()
    }), 200


@api.route("/cart/items/<int:item_id>", methods=["DELETE"])
@jwt_required()
def delete_item(item_id):
    item = CartItem.query.get(item_id)

    if not item:
        return jsonify({"error": "Item not found"}), 404

    current_user_id = int(get_jwt_identity())

    if item.cart.user_id != current_user_id:
        return jsonify({"error": "Unauthorized"}), 403

    db.session.delete(item)
    db.session.commit()

    return jsonify({"message": "Item deleted"}), 200

@api.route("/create-checkout-session/<int:user_id>", methods=["POST"])
@jwt_required()
def create_checkout_session(user_id):
    current_user_id = int(get_jwt_identity())

    if current_user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart or len(cart.items) == 0:
        return jsonify({"error": "Cart is empty"}), 400

    if not stripe.api_key:
        return jsonify({"error": "Stripe secret key not configured"}), 500

    line_items = []

    for item in cart.items:
        line_items.append({
            "price_data": {
                "currency": "eur",
                "product_data": {
                    "name": f"{item.shirt_variant.shirt.name} - {item.shirt_variant.size}"
                },
                "unit_amount": int(float(item.shirt_variant.price) * 100)
            },
            "quantity": item.quantity
        })

    session = stripe.checkout.Session.create(
        payment_method_types=["card"],
        line_items=line_items,
        mode="payment",
        success_url="https://opulent-space-chainsaw-697xjjwvp67r2rj65-3000.app.github.dev/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url="https://opulent-space-chainsaw-697xjjwvp67r2rj65-3000.app.github.dev/checkout"
    )

    return jsonify({"url": session.url}), 200

  