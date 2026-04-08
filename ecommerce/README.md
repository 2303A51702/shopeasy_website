# ShopEasy - E-Commerce Platform

## Prerequisites
- Node.js (v16+)
- MongoDB (running locally on port 27017)

## Setup & Run

### Backend
```bash
cd backend
npm install
# Edit .env if needed (MONGO_URI, JWT_SECRET)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173  
Backend runs at http://localhost:5000

## Create an Admin User
After signing up normally, open MongoDB shell or Compass and set `isAdmin: true` on your user:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { isAdmin: true } })
```
Then log out and log back in.

## Features
- Signup / Login with JWT auth
- Browse and search products
- Add to cart, update quantities, remove items
- Place orders with delivery address
- View order history with status
- Admin panel: add/edit/delete products, manage order statuses
