
from api.models import db, Shirt, ShirtVariant


shirts_data = [
    {
        "name": "Essence Black",
        "description": "Camiseta negra minimalista de corte limpio y estilo atemporal.",
        "image": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
    },
    {
        "name": "Stone Oversize",
        "description": "Diseño oversize en tono piedra para un look relajado y moderno.",
        "image": "https://images.unsplash.com/photo-1503341504253-dff4815485f1"
    },
    {
        "name": "Urban Cream",
        "description": "Base crema con estética urbana y acabados suaves.",
        "image": "https://images.unsplash.com/photo-1576566588028-4147f3842f27"
    },
    {
        "name": "Midnight Core",
        "description": "Una prenda oscura y versátil pensada para cualquier ocasión.",
        "image": "https://images.unsplash.com/photo-1583743814966-8936f37f4678"
    },
    {
        "name": "Soft Sand",
        "description": "Color arena y textura visual limpia para un outfit elegante.",
        "image": "https://images.unsplash.com/photo-1512436991641-6745cdb1723f"
    },
    {
        "name": "Raw White",
        "description": "Camiseta blanca esencial con identidad visual minimal.",
        "image": "https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d"
    },
    {
        "name": "Graphite Mood",
        "description": "Tono grafito con presencia sobria y muy combinable.",
        "image": "https://images.unsplash.com/photo-1618354691373-d851c5c3a990"
    },
    {
        "name": "Olive Frame",
        "description": "Color oliva con una vibra contemporánea y refinada.",
        "image": "https://images.unsplash.com/photo-1603252109303-2751441dd157"
    },
    {
        "name": "Dust Beige",
        "description": "Una prenda suave, neutra y perfecta para una colección limpia.",
        "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b"
    },
    {
        "name": "Shadow Fit",
        "description": "Camiseta de presencia fuerte y estilo visual oscuro.",
        "image": "https://images.unsplash.com/photo-1523398002811-999ca8dec234"
    },
    {
        "name": "Cold Ivory",
        "description": "Ivory frío con acabado moderno y estética premium.",
        "image": "https://images.unsplash.com/photo-1562157873-818bc0726f68"
    },
    {
        "name": "Muted Green",
        "description": "Verde apagado con un estilo muy natural y elegante.",
        "image": "https://images.unsplash.com/photo-1578932750294-f5075e85f44a"
    },
    {
        "name": "Clay Street",
        "description": "Inspirada en tonos tierra y líneas urbanas.",
        "image": "https://images.unsplash.com/photo-1484515991647-c5760fcecfc7"
    },
    {
        "name": "Noir Basic",
        "description": "Una básica negra imprescindible para cualquier armario.",
        "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c"
    },
    {
        "name": "Ash Line",
        "description": "Gris ceniza con estética sobria y muy pulida.",
        "image": "https://images.unsplash.com/photo-1551232864-3f0890e580d9"
    },
    {
        "name": "Nude Shape",
        "description": "Silueta simple con un color nude muy versátil.",
        "image": "https://images.unsplash.com/photo-1445205170230-053b83016050"
    },
    {
        "name": "Deep Moss",
        "description": "Verde musgo con personalidad y enfoque contemporáneo.",
        "image": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b"
    },
    {
        "name": "Mono Earth",
        "description": "Minimalismo en tonos tierra para una estética limpia.",
        "image": "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f"
    },
    {
        "name": "Silent Grey",
        "description": "Un gris suave con mucha facilidad para combinar.",
        "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf"
    },
    {
        "name": "Pure Form",
        "description": "Diseño puro y limpio pensado para destacar sin exceso.",
        "image": "https://images.unsplash.com/photo-1527719327859-c6ce80353573"
    }
]

sizes = ["S", "M", "L", "XL"]

prices = [24.99, 26.99, 28.99, 29.99, 31.99]


def seed_shirts():
    existing_shirts = Shirt.query.first()

    if existing_shirts:
        return

    for index, shirt_data in enumerate(shirts_data):
        new_shirt = Shirt(
            name=shirt_data["name"],
            description=shirt_data["description"],
            image=shirt_data["image"]
        )
        db.session.add(new_shirt)
        db.session.flush()

        base_price = prices[index % len(prices)]

        for size_index, size in enumerate(sizes):
            variant = ShirtVariant(
                shirt_id=new_shirt.id,
                size=size,
                stock=10 - size_index if 10 - size_index > 0 else 3,
                price=base_price
            )
            db.session.add(variant)

    db.session.commit()