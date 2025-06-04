# Food Ordering App - Backend API

## Description
A robust REST API backend for a food ordering application built with Node.js, Express, and MongoDB. The system supports user authentication, restaurant management, menu handling, and order processing.

## Tech Stack
- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- BCrypt for password hashing
- CORS for cross-origin requests

## Backend Folder Structure
```
/backend
├── config
│   ├── db.js
├── controllers
│   ├── authController.js
│   ├── menuController.js
│   ├── orderController.js
│   └── restaurantController.js
├── middlewares
│   ├── authMiddleware.js
│   └── errorHandler.js
├── models
│   ├── User.js
│   ├── Menu.js
│   ├── Order.js
│   └── Restaurant.js
├── routes
│   ├── authRoutes.js
│   ├── menuRoutes.js
│   ├── orderRoutes.js
│   └── restaurantRoutes.js
├── utils
│   └── helpers.js
├── .env
├── index.js
└── server.js
```

## Core Features

### 1. User Management
- User registration and authentication
- JWT-based authorization
- Role-based access (customer/admin)
- Secure password hashing

### 2. Restaurant Management
- Add/view restaurants (admin only)
- Location-based restaurant listing
- Menu management for each restaurant

### 3. Menu Management
- Add/update menu items
- Get restaurant-specific menus
- Price and item management

### 4. Order Processing
- Place new orders
- Track order status
- Order history tracking
- Status updates (Pending/Preparing/Completed/Cancelled)

## API Endpoints

### Auth Routes
```javascript
POST /api/Register     // User registration
POST /api/Login       // User login
GET  /api/user        // Get user details
```

### Restaurant Routes
```javascript
POST /api/admin       // Add new restaurant (Admin)
GET  /api/get/admin   // Get all restaurants
POST /api/:id/menu    // Add menu items
GET  /api/getmenu/:id // Get restaurant menu
```

### Order Routes
```javascript
POST /api/order       // Place new order
GET  /api/orders/:id  // Get order details
PUT  /api/:id/status  // Update order status
```

## Database Models

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  role: ['customer', 'admin']
}
```

### Restaurant Model
```javascript
{
  name: String,
  location: String,
  menuItems: [MenuItem]
}
```

### Order Model
```javascript
{
  user: ObjectId,
  restaurant: ObjectId,
  items: [{
    menuItem: ObjectId,
    quantity: Number
  }],
  totalPrice: Number,
  status: String
}
```

## Setup and Installation

### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB

### Installation Steps
1. Clone the repository
2. Install dependencies:
```bash
npm install express mongoose jsonwebtoken dotenv bcrypt cors
```

3. Create `.env` file with:
```
PORT=7000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```bash
npm start
```

## Security Features
- Password encryption using BCrypt
- JWT authentication middleware
- Protected routes for authorized access
- Input validation and sanitization
- CORS configuration for secure cross-origin requests

## Error Handling
- Custom error middleware
- Standardized error responses
- Proper HTTP status codes
- Detailed error messages for debugging

## Additional Features
- Integrated third-party payment gateways
- Real-time order tracking using WebSockets
- Location-based services
- Email notifications

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

