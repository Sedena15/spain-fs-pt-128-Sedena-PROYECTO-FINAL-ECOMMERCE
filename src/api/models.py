from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from flask_bcrypt import generate_password_hash, check_password_hash 

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(80), unique=True, nullable=False)
    firstname: Mapped[str] = mapped_column(String(80), nullable=False)
    lastname: Mapped[str] = mapped_column(String(80), nullable=False)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    image: Mapped[str] = mapped_column(String(255), nullable=True)

    cart: Mapped[list["Cart"]] = relationship("Cart", back_populates="user")

    def set_password(self,password):
        self.password_hash = generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
      return check_password_hash(self.password_hash, password)  

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "email": self.email,
            "image": self.image
        }

class Shirt(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    description: Mapped[str] =  mapped_column(String(120), nullable=True)
    image: Mapped[str] = mapped_column(String(255), nullable=True)

    variants: Mapped[list["ShirtVariant"]] = relationship(
        "ShirtVariant",
        back_populates="shirt",
    
    )

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "image": self.image,
            "variants": [v.serialize() for v in self.variants]
        }
    

class ShirtVariant(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    shirt_id: Mapped[int] = mapped_column(ForeignKey("shirt.id"), nullable=False)

    size: Mapped[str] = mapped_column(String(10), nullable=False)
    stock: Mapped[int] = mapped_column(nullable=False, default=0)
    price: Mapped[float] = mapped_column(nullable=False)

    shirt: Mapped["Shirt"] = relationship("Shirt", back_populates="variants")
    cart_items: Mapped[list["CartItem"]] = relationship(
        "CartItem",
        back_populates="shirt_variant"
    )

    def serialize(self):
        return {
            "id": self.id,
            "size": self.size,
            "stock": self.stock,
            "price": self.price,
            "shirt_id": self.shirt_id
        }
    
class Cart(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)

    user: Mapped["User"] = relationship("User", back_populates="cart")
    items: Mapped[list["CartItem"]] = relationship(
        "CartItem",
        back_populates="cart",
    )
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "items": [item.serialize() for item in self.items]
    }
    
class CartItem(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)

    cart_id: Mapped[int] = mapped_column(ForeignKey("cart.id"), nullable=False)
    shirt_variant_id: Mapped[int] = mapped_column(ForeignKey("shirt_variant.id"), nullable=False)

    quantity: Mapped[int] = mapped_column(nullable=False, default=1)

    cart: Mapped["Cart"] = relationship("Cart", back_populates="items")
    shirt_variant: Mapped["ShirtVariant"] = relationship(
        "ShirtVariant",
        back_populates="cart_items"
    )
    
    def serialize(self):
        return {
             "id": self.id,
             "quantity": self.quantity,
             "size": self.shirt_variant.size,
             "price": self.shirt_variant.price,
             "shirt_id": self.shirt_variant.shirt.id,
             "shirt_name": self.shirt_variant.shirt.name,
             "image": self.shirt_variant.shirt.image
    }