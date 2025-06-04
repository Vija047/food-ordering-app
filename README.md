# Food Ordering Application

A MERN stack food ordering application with user authentication and real-time order tracking.

## Project Goals
- Create a user-friendly food ordering platform
- Implement secure user authentication and authorization
- Provide real-time order tracking capabilities
- Enable restaurant owners to manage their menu and orders
- Ensure smooth payment processing
- Implement responsive design for all devices

## Project Structure

### Backend Structure
```
backend/
├── config/
│   ├── db.js
│   └── config.js
├── controllers/
│   ├── authController.js
│   ├── menuController.js
│   └── orderController.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Menu.js
│   └── Order.js
├── routes/
│   ├── auth.js
│   ├── menu.js
│   └── orders.js
├── utils/
│   └── validators.js
├── .env
└── server.js
```

### Frontend Structure
```
frontend-app/
├── public/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   ├── Menu/
│   │   ├── Orders/
│   │   └── common/
│   ├── context/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Environment Setup

### Prerequisites
- Node.js
- MongoDB Atlas Account
- npm or yarn

### Environment Variables
Create a `.env` file in the backend directory with:
```
MONGO_URI=your_mongodb_uri
PORT=7000
JWT_SECRET=your_secret_key
```

## Installation

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend-app
npm install
npm start
```

## Features
- User Authentication
- Food Menu Management
- Order Processing
- Real-time Order Tracking

## Tech Stack
- MongoDB
- Express.js
- React.js
- Node.js

## API Documentation
Base URL: `http://localhost:7000/api`

### Auth Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/logout` - User logout

### Menu Endpoints
- `GET /menu` - Get all menu items
- `GET /menu/:id` - Get specific menu item
- `POST /menu` - Add new menu item (Admin)
- `PUT /menu/:id` - Update menu item (Admin)
- `DELETE /menu/:id` - Delete menu item (Admin)
- `GET /menu/categories` - Get all categories

### Order Endpoints
- `POST /orders` - Place new order
- `GET /orders` - Get user's orders
- `GET /orders/:id` - Get specific order details
- `PUT /orders/:id/status` - Update order status (Admin)
- `GET /orders/history` - Get order history
- `POST /orders/:id/cancel` - Cancel order

### Payment Endpoints
- `POST /payment/create` - Create payment intent
- `POST /payment/verify` - Verify payment
- `GET /payment/history` - Get payment history

### Admin Endpoints
- `GET /admin/dashboard` - Get dashboard statistics
- `GET /admin/orders` - Get all orders (Admin)
- `GET /admin/users` - Get all users (Admin)
- `PUT /admin/users/:id` - Update user role
- `GET /admin/analytics` - Get sales analytics

## Contributing
Pull requests are welcome. For major changes, please open an issue first.

## License
MIT
