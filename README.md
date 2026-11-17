# ELEGACY · Tienda de camisetas

Proyecto final de 4Geeks Academy. Aplicación web full stack con catálogo de camisetas, variantes por talla, perfiles de usuario y carrito persistente.

## Qué puedes probar

- Consultar el catálogo y abrir el detalle de una camiseta para ver sus tallas, precio y stock.
- Registrarte, iniciar sesión y editar tu perfil. La API usa JWT para proteger el perfil y el carrito de cada usuario.
- Añadir variantes al carrito, cambiar cantidades y eliminar artículos. El carrito se guarda en la base de datos.
- Abrir Stripe Checkout en modo de prueba si configuras una clave de prueba.

El frontend usa React, Vite y Bootstrap. Flask expone la API REST en `/api`. Los modelos están en [src/api/models.py](src/api/models.py) y las migraciones de Alembic en [migrations/](migrations/).

## Ejecutar en local

Necesitas Node.js 20 o posterior, Python 3.10, Pipenv y una base de datos PostgreSQL vacía.

1. Instala las dependencias y crea el archivo de configuración:

   ```bash
   pipenv sync
   npm ci
   cp .env.example .env
   ```

2. Ajusta `DATABASE_URL` con los datos de tu base de datos. Genera un valor de `JWT_SECRET_KEY` con `python -c "import secrets; print(secrets.token_hex(32))"` y guárdalo en `.env`.
3. Aplica la migración y arranca Flask:

   ```bash
   pipenv run upgrade
   pipenv run start
   ```

4. En otra terminal, ejecuta `npm run dev` y abre [localhost:3000](http://localhost:3000). Vite reenvía las peticiones de `/api` a Flask en el puerto 3001. El catálogo se carga con datos de ejemplo en la primera consulta.

Para probar el checkout, define `STRIPE_SECRET_KEY` con una clave de prueba de Stripe (`sk_test_...`) y reinicia Flask. En local, las redirecciones vuelven a `http://localhost:3000`.

## API principal

| Método y ruta | Función |
| --- | --- |
| `GET /api/shirts` | Listar camisetas. |
| `GET /api/shirts/<id>` | Ver una camiseta y sus variantes. |
| `POST /api/users` | Crear una cuenta. |
| `POST /api/login` | Obtener un JWT. |
| `GET /api/cart/<id_usuario>` | Consultar el carrito con el JWT del propietario. |
| `POST /api/cart/items` | Añadir una variante al carrito. |
| `PUT /api/cart/items/<id>` | Cambiar la cantidad de un artículo. |
| `DELETE /api/cart/items/<id>` | Eliminar un artículo del carrito. |

## Despliegue

Render sirve el frontend compilado y la API desde el mismo dominio. Configura `DATABASE_URL` y `JWT_SECRET_KEY` en el entorno del servicio. Para habilitar el checkout de prueba, configura también `STRIPE_SECRET_KEY` y `CHECKOUT_FRONTEND_URL` con la URL pública de la tienda.

Proyecto basado en la [plantilla React y Flask de 4Geeks Academy](https://4geeks.com/docs/start/react-flask-template).


## Búsqueda de camisetas con IA

Configura `OPENAI_API_KEY` en el backend (en `.env` para desarrollo o en **Environment** del servicio de Render). Puedes definir `OPENAI_MODEL` para usar otro modelo compatible con Structured Outputs. Por defecto se usa `gpt-4.1-mini`.

El buscador admite consultas como «Camiseta negra, talla M, por menos de 30 €». Flask envía la consulta a OpenAI para extraer filtros y devuelve hasta tres camisetas con variantes que cumplan las condiciones y tengan stock. La clave permanece en el servidor y el buscador aparece cuando está configurada.

El endpoint limita las llamadas a OpenAI a 10 por minuto por proceso. Configura el presupuesto de API de tu proyecto por separado si habilitas la búsqueda en la demo pública.
