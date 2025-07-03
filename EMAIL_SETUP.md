# Email Notification Setup Guide

## Overview
This system sends email notifications for order confirmations and restaurant notifications when orders are placed. The implementation includes:

1. **Customer Email Notifications**: Detailed order confirmation with tracking ID
2. **Restaurant Owner Notifications**: Urgent new order alerts with all order details

## Email Service Configuration

### 1. Gmail Setup (Recommended)
To use Gmail for sending emails, you need to:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Navigate to Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
   - Use this password in your .env file

### 2. Environment Variables Setup
Create a `.env` file in the backend folder with:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Default restaurant email for notifications
DEFAULT_RESTAURANT_EMAIL=restaurant@example.com

# Other configurations
PORT=7000
NODE_ENV=development
```

### 3. Alternative Email Services
You can also use other email services by modifying the transporter in `/backend/utils/emailService.js`:

```javascript
// For Outlook/Hotmail
service: 'hotmail'

// For Yahoo
service: 'yahoo'

// For custom SMTP
host: 'your-smtp-server.com',
port: 587,
secure: false,
auth: {
  user: 'your-email@domain.com',
  pass: 'your-password'
}
```

## Features Implemented

### 1. Order Management
- **Enhanced Order Model**: Supports detailed order information including customer contact details
- **Unique Order IDs**: Generated automatically for easy tracking
- **Order Status Tracking**: Pending → Preparing → Out for Delivery → Delivered

### 2. Email Notifications

#### Customer Confirmation Email
- Beautiful HTML email template
- Complete order details with itemized billing
- Order tracking information
- Estimated delivery time
- Professional branding

#### Restaurant Notification Email
- Urgent priority styling with red alerts
- Complete customer contact information
- Detailed order items with special instructions
- Action items for restaurant staff
- Real-time order processing requirements

### 3. Frontend Improvements
- **Customer Information Form**: Email and phone input fields
- **Enhanced Checkout Process**: Comprehensive order data collection
- **Detailed Success Messages**: Complete order confirmation with tracking info
- **Order Tracking Page**: Search and view orders by ID
- **Coupon System**: Working discount code functionality

## API Endpoints

### Place Order
```
POST /api/orders
```
**Request Body:**
```json
{
  "items": [...],
  "subtotal": 450.00,
  "discount": 50.00,
  "tax": 40.00,
  "deliveryFee": 0,
  "packagingFee": 20.00,
  "total": 460.00,
  "address": "Customer delivery address",
  "appliedCoupon": {...},
  "customerEmail": "customer@example.com",
  "customerPhone": "+91 9876543210"
}
```

**Response:**
```json
{
  "message": "Order placed successfully",
  "orderId": "ORD123456789",
  "order": {...},
  "emailNotifications": {
    "customerNotification": {...},
    "restaurantNotifications": {...}
  },
  "estimatedDeliveryTime": "..."
}
```

### Track Order
```
GET /api/orders/:orderId
```

### Update Order Status (Admin)
```
PUT /api/orders/:orderId/status
```

## Testing the System

### 1. Backend Testing
1. Start the backend server: `node index.js`
2. Ensure MongoDB is connected
3. Test email service configuration

### 2. Frontend Testing
1. Add items to cart
2. Fill in delivery address and contact information
3. Apply a coupon (SAVE50, FIRST20, WELCOME100)
4. Complete checkout
5. Check for email notifications
6. Test order tracking functionality

### 3. Email Testing
**Note**: For production use, replace `restaurant@example.com` with actual restaurant owner emails from your database.

## Production Considerations

### 1. Database Integration
- Implement proper user authentication
- Store restaurant owner emails in the database
- Add order history for logged-in users

### 2. Email Delivery
- Use professional email service (SendGrid, AWS SES, etc.)
- Implement email queuing for high volume
- Add email delivery status tracking

### 3. Security
- Validate all order data
- Implement rate limiting
- Add CORS configuration for production domain

### 4. Monitoring
- Log all email sending attempts
- Monitor order placement success rates
- Track email delivery rates

## Troubleshooting

### Common Issues
1. **Email not sending**: Check Gmail app password and 2FA settings
2. **CORS errors**: Update frontend URL in backend CORS configuration
3. **Order not saving**: Check MongoDB connection and model validation

### Debug Steps
1. Check backend console for email sending logs
2. Verify environment variables are loaded
3. Test with a simple email service like Mailtrap for development

## Next Steps
1. Set up your Gmail app password
2. Update the .env file with your credentials
3. Test the order flow end-to-end
4. Customize email templates with your branding
5. Implement restaurant owner database integration
