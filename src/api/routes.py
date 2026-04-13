"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Shirt, Cart, CartItem, ShirtVariant
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

@api.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
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
        password=password,
        image=image
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User created successfully",
        "user": new_user.serialize()
    }), 201


@api.route("/users/<int:user_id>", methods=["PUT"])
def update_user(user_id):
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
    user.password = data.get("password", user.password)
    user.image = data.get("image", user.image)

    db.session.commit()

    return jsonify({
        "message": "User updated successfully",
        "user": user.serialize()
    }), 200


@api.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({"message": "User deleted successfully"}), 200


@api.route("/shirts", methods=["GET"])
def get_shirts():
    shirts = Shirt.query.all()
    return jsonify([shirt.serialize() for shirt in shirts]), 200


@api.route("/shirts/<int:shirt_id>", methods=["GET"])
def get_shirt(shirt_id):
    shirt = Shirt.query.get(shirt_id)

    if shirt:
        return jsonify(shirt.serialize()), 200

    return jsonify({"error": "Shirt not found"}), 404


@api.route("/cart/<int:user_id>", methods=["GET"])
def get_cart(user_id):
    cart = Cart.query.filter_by(user_id=user_id).first()

    if not cart:
        return jsonify({"error": "Cart not found"}), 404

    return jsonify(cart.serialize()), 200


@api.route("/cart/items", methods=["POST"])
def add_to_cart():
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    user_id = data.get("user_id")
    variant_id = data.get("shirt_variant_id")
    quantity = data.get("quantity", 1)

    if not user_id or not variant_id:
        return jsonify({"error": "user_id and shirt_variant_id are required"}), 400

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

    if quantity < 1:
        return jsonify({"error": "Quantity must be at least 1"}), 400

    item.quantity = quantity
    db.session.commit()

    return jsonify({
        "message": "Cart item updated",
        "item": item.serialize()
    }), 200


@api.route("/cart/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    item = CartItem.query.get(item_id)

    if item:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Item deleted"}), 200

    return jsonify({"error": "Item not found"}), 404

