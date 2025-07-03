const nodemailer = require('nodemailer');

// Create transporter with Gmail (you can change this to any email service)
const createTransporter = () => {
    return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com', // Set in .env file
            pass: process.env.EMAIL_PASS || 'your-app-password', // Use App Password for Gmail
        },
    });
};

// Send order confirmation email to customer
const sendOrderConfirmationEmail = async (orderData, customerEmail) => {
    try {
        const transporter = createTransporter();

        const orderItemsHtml = orderData.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    ${item.name} (${item.restaurant})
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                    ${item.quantity}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                    ₹${(item.price * item.quantity).toFixed(2)}
                </td>
            </tr>
        `).join('');

        const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .header { background-color: #fbbf24; padding: 20px; text-align: center; }
                .content { padding: 20px; }
                .order-details { background-color: #f9f9f9; padding: 15px; margin: 15px 0; }
                .total { font-weight: bold; font-size: 18px; color: #fbbf24; }
                table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                th { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 style="color: #000; margin: 0;">Order Confirmation</h1>
                <p style="color: #000; margin: 5px 0;">Thank you for your order!</p>
            </div>
            
            <div class="content">
                <div class="order-details">
                    <h2>Order Details</h2>
                    <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                    <p><strong>Order Date:</strong> ${new Date(orderData.createdAt).toLocaleString()}</p>
                    <p><strong>Estimated Delivery:</strong> ${new Date(orderData.estimatedDeliveryTime).toLocaleString()}</p>
                    <p><strong>Delivery Address:</strong> ${orderData.address}</p>
                </div>

                <h3>Order Items</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderItemsHtml}
                    </tbody>
                </table>

                <div class="order-details">
                    <h3>Bill Summary</h3>
                    <p>Subtotal: ₹${orderData.subtotal.toFixed(2)}</p>
                    ${orderData.discount > 0 ? `<p style="color: green;">Discount: -₹${orderData.discount.toFixed(2)}</p>` : ''}
                    <p>Tax: ₹${orderData.tax.toFixed(2)}</p>
                    <p>Delivery Fee: ${orderData.deliveryFee === 0 ? 'FREE' : '₹' + orderData.deliveryFee.toFixed(2)}</p>
                    <p>Packaging Fee: ₹${orderData.packagingFee.toFixed(2)}</p>
                    <hr>
                    <p class="total">Total: ₹${orderData.total.toFixed(2)}</p>
                </div>

                <div style="background-color: #e3f2fd; padding: 15px; margin-top: 20px;">
                    <h3>Track Your Order</h3>
                    <p>Use Order ID: <strong>${orderData.orderId}</strong> to track your order status.</p>
                    <p>You can check your order status on our website or contact us for updates.</p>
                </div>

                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                    <p>Thank you for choosing our food delivery service!</p>
                    <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply to this email.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: customerEmail,
            subject: `Order Confirmation - Order ID: ${orderData.orderId}`,
            html: emailHtml,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent:', result.messageId);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        return { success: false, error: error.message };
    }
};

// Send new order notification to restaurant owners
const sendRestaurantNotificationEmail = async (orderData, restaurantEmails) => {
    try {
        const transporter = createTransporter();

        // Group items by restaurant
        const restaurantItems = {};
        orderData.items.forEach(item => {
            if (!restaurantItems[item.restaurant]) {
                restaurantItems[item.restaurant] = [];
            }
            restaurantItems[item.restaurant].push(item);
        });

        const notifications = [];

        // Send email to each restaurant involved in the order
        for (const [restaurantName, items] of Object.entries(restaurantItems)) {
            const restaurantItemsHtml = items.map(item => `
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">
                        ${item.name}
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                        ${item.quantity}
                    </td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                        ₹${(item.price * item.quantity).toFixed(2)}
                    </td>
                    ${item.note ? `<td style="padding: 10px; border-bottom: 1px solid #eee;">${item.note}</td>` : '<td></td>'}
                </tr>
            `).join('');

            const restaurantTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .header { background-color: #f44336; padding: 20px; text-align: center; color: white; }
                    .content { padding: 20px; }
                    .order-details { background-color: #fff3cd; padding: 15px; margin: 15px 0; border: 1px solid #ffeaa7; }
                    .urgent { background-color: #ffebee; padding: 15px; margin: 15px 0; border-left: 4px solid #f44336; }
                    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
                    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🚨 NEW ORDER RECEIVED</h1>
                    <p style="margin: 5px 0;">Immediate attention required!</p>
                </div>
                
                <div class="content">
                    <div class="urgent">
                        <h2>⏰ ORDER PRIORITY: HIGH</h2>
                        <p><strong>Restaurant:</strong> ${restaurantName}</p>
                        <p><strong>Order ID:</strong> ${orderData.orderId}</p>
                        <p><strong>Order Time:</strong> ${new Date(orderData.createdAt).toLocaleString()}</p>
                        <p><strong>Expected Delivery:</strong> ${new Date(orderData.estimatedDeliveryTime).toLocaleString()}</p>
                    </div>

                    <div class="order-details">
                        <h3>Customer Information</h3>
                        <p><strong>Delivery Address:</strong> ${orderData.address}</p>
                        ${orderData.customerEmail ? `<p><strong>Email:</strong> ${orderData.customerEmail}</p>` : ''}
                        ${orderData.customerPhone ? `<p><strong>Phone:</strong> ${orderData.customerPhone}</p>` : ''}
                    </div>

                    <h3>Items to Prepare</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Name</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                                <th>Special Instructions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${restaurantItemsHtml}
                        </tbody>
                    </table>

                    <div class="order-details">
                        <h3>Your Restaurant Total: ₹${restaurantTotal.toFixed(2)}</h3>
                        <p><strong>Status:</strong> ${orderData.status}</p>
                    </div>

                    <div style="background-color: #e8f5e8; padding: 15px; margin-top: 20px; border: 1px solid #4caf50;">
                        <h3>Action Required</h3>
                        <p>✅ Please confirm order acceptance</p>
                        <p>🍳 Start preparation immediately</p>
                        <p>⏱️ Estimated prep time: 30-35 minutes</p>
                        <p>📞 Contact customer if needed: ${orderData.customerPhone || 'No phone provided'}</p>
                    </div>

                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                        <p style="color: #f44336; font-weight: bold;">This order requires immediate attention!</p>
                        <p style="color: #666; font-size: 12px;">This is an automated notification from the food delivery system.</p>
                    </div>
                </div>
            </body>
            </html>
            `;

            // For demo purposes, we'll use a generic restaurant email
            // In production, you should fetch actual restaurant owner emails from the database
            const restaurantEmail = restaurantEmails[restaurantName] || process.env.DEFAULT_RESTAURANT_EMAIL || 'restaurant@example.com';

            const mailOptions = {
                from: process.env.EMAIL_USER || 'your-email@gmail.com',
                to: restaurantEmail,
                subject: `🚨 URGENT: New Order #${orderData.orderId} - ${restaurantName}`,
                html: emailHtml,
            };

            const result = await transporter.sendMail(mailOptions);
            notifications.push({
                restaurant: restaurantName,
                success: true,
                messageId: result.messageId
            });
            console.log(`Restaurant notification sent to ${restaurantName}:`, result.messageId);
        }

        return { success: true, notifications };
    } catch (error) {
        console.error('Error sending restaurant notification emails:', error);
        return { success: false, error: error.message };
    }
};

module.exports = {
    sendOrderConfirmationEmail,
    sendRestaurantNotificationEmail,
};
