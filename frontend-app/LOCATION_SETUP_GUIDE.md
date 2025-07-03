# Restaurant Location Component Setup Guide

## Overview
The Location component has been updated with real-time functionality and uses actual restaurant data. This guide explains how to customize it for your restaurant.

## Features ✨

- **Real-time Open/Closed Status**: Automatically updates based on current time and operating hours
- **Interactive Google Maps**: Embedded map with your exact restaurant location
- **Functional Action Buttons**: 
  - Get Directions (opens in Google Maps)
  - Call Now (initiates phone call)
  - WhatsApp Order (opens WhatsApp chat)
- **Dynamic Operating Hours Display**: Shows all weekly hours with current status
- **Responsive Design**: Looks great on all devices

## How to Customize 🛠️

### 1. Update Restaurant Information

Edit the file: `src/utils/restaurantData.js`

```javascript
export const restaurantData = {
  name: "Your Restaurant Name",
  description: "Your restaurant description",
  address: {
    street: "Your Street Address",
    area: "Your Area/Locality", 
    city: "Your City",
    state: "Your State",
    pincode: "Your Pincode",
    country: "Your Country"
  },
  coordinates: {
    lat: 12.9784,  // Your exact latitude
    lng: 77.6408   // Your exact longitude
  },
  contact: {
    phone: "+91 XXXXXXXXXX",      // Your phone number
    email: "your@email.com",      // Your email
    whatsapp: "+91 XXXXXXXXXX"    // Your WhatsApp number
  },
  hours: {
    monday: { open: "10:00", close: "23:00" },
    tuesday: { open: "10:00", close: "23:00" },
    // ... update all days with your actual hours
  }
};
```

### 2. Get Your Restaurant Coordinates

**Method 1: Google Maps**
1. Go to [Google Maps](https://maps.google.com)
2. Search for your restaurant address
3. Right-click on the exact location
4. Select "What's here?"
5. Copy the coordinates (latitude, longitude)

**Method 2: GPS Coordinates App**
- Use any GPS app on your phone
- Visit your restaurant location
- Copy the coordinates

### 3. Update Operating Hours

Update the `hours` object in `restaurantData.js` with your actual operating hours:

```javascript
hours: {
  monday: { open: "10:00", close: "22:00" },
  tuesday: { open: "10:00", close: "22:00" },
  wednesday: { open: "10:00", close: "22:00" },
  thursday: { open: "10:00", close: "22:00" },
  friday: { open: "10:00", close: "23:00" },
  saturday: { open: "09:00", close: "23:00" },
  sunday: { open: "09:00", close: "22:00" }
}
```

**Time Format**: Use 24-hour format (HH:MM)
- 9:00 AM = "09:00"
- 2:30 PM = "14:30" 
- 11:00 PM = "23:00"

### 4. Update Contact Information

```javascript
contact: {
  phone: "+91 98765 43210",           // Format: +91 XXXXXXXXXX
  email: "info@yourrestaurant.com",   // Your business email
  whatsapp: "+91 98765 43210"         // Same as phone or different WhatsApp number
}
```

### 5. Customize Services (Optional)

Update the services section to match what you offer:

```javascript
services: {
  delivery: {
    available: true,
    radius: "5km",
    estimatedTime: "30-45 minutes"
  },
  parking: {
    available: true,
    type: "Free parking available"
  },
  payments: ["Cash", "Cards", "UPI", "PayTM", "GPay"]
}
```

## Testing Your Changes 🧪

1. **Save all files** after making changes
2. **Restart your development server**:
   ```bash
   npm start
   ```
3. **Check the following**:
   - Map shows your correct location
   - Address displays correctly
   - Phone number works when clicked
   - WhatsApp link opens correctly
   - Open/Closed status is accurate
   - Operating hours display correctly

## Real-time Features ⏰

### Open/Closed Status
- Automatically updates every minute
- Compares current time with your operating hours
- Shows green "Open Now" or red "Closed"
- Displays current time

### Interactive Elements
- **Get Directions**: Opens Google Maps with route to your restaurant
- **Call Now**: Initiates phone call on mobile devices
- **WhatsApp Order**: Opens WhatsApp chat with your number

## Troubleshooting 🔧

### Map Not Showing
- Check if coordinates are correct
- Ensure you have internet connection
- Verify the coordinates format (latitude, longitude)

### Wrong Open/Closed Status
- Check your operating hours format (24-hour HH:MM)
- Verify day names are lowercase
- Check your system time is correct

### Buttons Not Working
- Ensure phone numbers include country code (+91 for India)
- Check WhatsApp number format
- Verify coordinates for directions

## File Structure

```
src/
├── components/pages/
│   └── Location.js          # Main location component
└── utils/
    └── restaurantData.js    # Restaurant data configuration
```

## Need Help? 🆘

1. **Double-check** all data in `restaurantData.js`
2. **Restart** your development server after changes
3. **Test** each feature individually
4. **Check browser console** for any errors

---

**Remember**: After updating the restaurant data, always test the component to ensure all features work correctly with your specific information.
