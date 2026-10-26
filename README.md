# BellyBoss

A small food ordering demo built with the original HTML/CSS frontend, Node.js, Express, JWT, and MongoDB.

## Run locally

1. Install Node.js (18 or newer) and create a MongoDB Atlas cluster or local MongoDB database.
2. Run `npm install` in the project folder.
3. Copy `.env.example` to `.env`. Replace the demo `MONGODB_URI` with your real connection string and change `JWT_SECRET` to a long random value. The example URI is only a placeholder and will not connect.
4. Run `npm run dev` (or `npm start`) and open <http://localhost:3000>.

The six menu items are inserted into the `products` collection on first startup. The app stores accounts in `users`, one cart per account in `carts`, and completed checkouts in `orders`. Passwords are hashed. JWTs are held in browser `sessionStorage` and sent on protected cart and order requests.

## API overview

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | Create an account | Public |
| POST | `/api/auth/login` | Log in and receive JWT | Public |
| GET | `/api/auth/me` | Read current account | JWT |
| GET | `/api/products` | List active menu items | Public |
| GET | `/api/cart` | Read current cart | JWT |
| POST | `/api/cart` | Add an item (`productId`, optional `quantity`) | JWT |
| PATCH | `/api/cart/:productId` | Set item quantity | JWT |
| DELETE | `/api/cart/:productId` | Remove item | JWT |
| POST | `/api/orders` | Place order (`deliveryDetails`, `paymentMethod`) | JWT |

This demo records payment choice only; it does not process payments.
