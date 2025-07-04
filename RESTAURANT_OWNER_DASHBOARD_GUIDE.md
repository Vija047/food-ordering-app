# Restaurant Owner Dashboard - User Guide

## Overview
The Restaurant Owner Dashboard provides comprehensive order management and tracking capabilities for restaurant owners. This system allows restaurant owners to view, manage, and track customer orders in real-time.

## Features

### 1. Dashboard Overview
- **Total Orders**: View total number of orders received
- **Today's Orders**: Orders received today
- **Today's Revenue**: Revenue generated today
- **Pending Orders**: Orders waiting to be processed

### 2. Order Management
- **Real-time Order Updates**: Orders refresh automatically every 30 seconds
- **Order Status Updates**: Update order status through the workflow
- **Order Filtering**: Filter orders by status (Pending, Preparing, Out for Delivery, Delivered, Cancelled)
- **Search Functionality**: Search orders by Order ID, customer email, or phone number
- **Date Filtering**: Filter orders by date (Today, All time)

### 3. Order Tracking System
The system provides a complete order tracking workflow:

1. **Pending** → Order received and being processed
2. **Preparing** → Food is being prepared
3. **Out for Delivery** → Order is on its way to customer
4. **Delivered** → Order successfully delivered

### 4. Customer Order Tracking
Customers can track their orders using:
- Order ID
- Visual tracking timeline
- Estimated delivery time
- Real-time status updates

## How to Use

### For Restaurant Owners

1. **Access the Dashboard**: Navigate to `/restaurant-owner` in the application
2. **View Orders**: All orders are displayed in a table format with customer information
3. **Update Order Status**: Click the green checkmark button to move an order to the next status
4. **View Order Details**: Click the eye icon to see detailed order information and tracking
5. **Filter Orders**: Use the dropdown menus to filter by status or date
6. **Search Orders**: Use the search box to find specific orders

### For Customers

1. **Access Order Tracking**: Navigate to `/track-order` in the application
2. **Enter Order ID**: Input your order ID (e.g., ORD123456)
3. **View Tracking**: See your order progress through the tracking timeline
4. **Get Updates**: Real-time status updates and estimated delivery time

## Technical Implementation

### Backend APIs
- `GET /api/restaurant/:restaurantId/dashboard` - Get dashboard statistics
- `GET /api/restaurant/:restaurantId/orders` - Get restaurant orders
- `PUT /api/restaurant/order/:orderId/status` - Update order status
- `GET /api/restaurant/:restaurantId/details` - Get restaurant details
- `GET /api/orders/:orderId` - Get order details for tracking

### Frontend Components
- **RestaurantOwnerDashboard**: Main dashboard component
- **OrderTracking**: Customer order tracking component
- **Real-time Updates**: Auto-refresh functionality
- **Responsive Design**: Mobile-friendly interface

## Sample Order IDs for Testing
Here are some sample order IDs you can use to test the tracking system:
- ORD860862827
- ORD890998095
- ORD891110709

## Error Handling
The system includes comprehensive error handling:
- Backend server connection errors
- Order not found errors
- Invalid order ID format errors
- Network connectivity issues

## Security Features
- Input validation for order IDs
- Restaurant-specific order filtering
- Secure API endpoints
- Error message sanitization

## Future Enhancements
- Real-time notifications using WebSockets
- Order assignment to delivery personnel
- Advanced analytics and reporting
- Customer feedback integration
- Multi-restaurant support for franchise owners

## Support
For technical issues or questions, please contact the development team.
