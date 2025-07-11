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
# Food Ordering App - Restaurant Management System

## Overview
This is a complete MERN stack food ordering application with a comprehensive restaurant management system. The application includes both customer-facing features and admin management capabilities.

## Features Implemented

### ✅ Admin Restaurant Management
- **Add Restaurants**: Admins can add new restaurants with name and location
- **View Restaurants**: Display all restaurants with management options
- **Restaurant Dashboard**: Overview of total restaurants and recent additions

### ✅ Menu Item Management (Fully Functional)
- **Add Menu Items**: Create new menu items with:
  - Name, price, description
  - Image upload support
  - Category assignment
  - Restaurant association
- **Edit Menu Items**: Update existing menu items including:
  - Name, price, description changes
  - Image replacement
  - Real-time UI updates
- **Delete Menu Items**: Remove menu items with:
  - Confirmation dialogs
  - Automatic cleanup from restaurant references
  - Immediate UI updates
- **View Menu Items**: Display all menu items with:
  - Filtering by restaurant
  - Search functionality
  - Beautiful card layouts

### ✅ Backend API Endpoints

#### Restaurant Endpoints
- `GET /api/restaurants` - Get all restaurants
- `POST /api/admin` - Add new restaurant (Admin only)
- `GET /api/admin/restaurants` - Get restaurants for admin dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

#### Menu Item Endpoints
- `POST /api/:id/menu` - Add menu item to restaurant (with image upload)
- `PUT /api/menu/:menuItemId` - Update menu item (with image upload)
- `DELETE /api/menu/:menuItemId` - Delete menu item
- `GET /api/allmenu` - Get all menu items
- `GET /api/getmenu/:id` - Get menu items for specific restaurant

### ✅ Frontend Features
- **Responsive Design**: Beautiful, modern UI with Bootstrap and custom styling
- **Real-time Updates**: Immediate feedback on all operations
- **Image Upload**: Support for menu item images with fallback handling
- **Error Handling**: Comprehensive error messages and validation
- **Loading States**: Loading indicators for all async operations
- **Modals**: Edit and delete confirmation dialogs
- **Authentication**: Admin-only access to management features
- **Navigation**: Intuitive tab-based interface

### ✅ Technical Implementation

#### Frontend Technologies
- React.js with hooks
- Bootstrap 5 for styling
- Lucide React for icons
- Form handling with FormData for file uploads
- Local storage for authentication

#### Backend Technologies
- Node.js with Express
- MongoDB with Mongoose
- Multer for file uploads
- JWT authentication
- CORS enabled
- Error handling middleware

#### Database Models
- **Restaurant Model**: Name, location, menu items array, timestamps
- **MenuItem Model**: Name, price, description, image, category, restaurant reference

### ✅ File Structure
```
Food-ordering-app/
├── backend/
│   ├── controllers/
│   │   └── Restaurant_Menu_Management/
│   │       ├── RestaurantController.js (Updated)
│   │       └── Menucontroller.js
│   ├── Routes/
│   │   └── RestaurntRoutes.js (Updated)
│   ├── Models/
│   │   ├── Restaurants.js
│   │   └── MenuItems.js
│   └── uploads/ (Created for images)
├── frontend-app/
│   └── src/
│       └── componets/
│           └── admin/
│               └── Restaurant.js (Fully Updated)
└── test-menu-api.js (Created for testing)
```

### ✅ Key Updates Made

#### Backend Updates
1. **Enhanced RestaurantController.js**:
   - Improved `updateMenuItem` function with FormData support
   - Enhanced `deleteMenuItem` with restaurant reference cleanup
   - Added file upload handling for updates

2. **Updated Routes**:
   - Added multer middleware to PUT route for image uploads
   - Maintained all existing authentication and authorization

#### Frontend Updates
1. **Complete Restaurant.js Overhaul**:
   - Added edit functionality with modal interface
   - Added delete functionality with confirmation dialog
   - Implemented proper state management for all operations
   - Added image upload support for both add and edit operations
   - Enhanced error handling and user feedback
   - Improved responsive design and animations

### ✅ Authentication & Authorization
- JWT-based authentication
- Admin role verification
- Protected routes for management operations
- Proper error handling for unauthorized access

### ✅ Image Handling
- Multer configuration for file uploads
- Support for image updates
- Fallback image handling
- Proper file validation (image types only)
- 5MB file size limit

### ✅ User Experience
- Smooth animations and transitions
- Intuitive navigation with tabs
- Real-time feedback on all operations
- Loading states and error messages
- Responsive design for all device sizes
- Beautiful modern UI with gradients and shadows

### ✅ Testing
- Created comprehensive API test script
- All CRUD operations tested
- File upload functionality verified
- Authentication flow validated

## How to Use

1. **Start the Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend-app
   npm start
   ```

3. **Access Admin Panel**:
   - Go to `http://localhost:3000/admin`
   - Login with admin credentials
   - Navigate between "Restaurants" and "Menu Items" tabs

4. **Manage Menu Items**:
   - Select a restaurant from the dropdown
   - Add new menu items with images
   - Edit existing items by clicking the "Edit" button
   - Delete items with confirmation dialog
   - View all items with filtering options

## Status: ✅ FULLY FUNCTIONAL

The restaurant management system is now completely functional with all CRUD operations working for both restaurants and menu items. The application provides a professional-grade admin interface with proper error handling, file uploads, and responsive design.
