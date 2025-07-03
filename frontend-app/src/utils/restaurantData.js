// Restaurant configuration data
// Update this file with your actual restaurant information

export const restaurantData = {
    name: "DishDash Restaurant",
    description: "Experience authentic flavors in the heart of Indiranagar",
    address: {
        street: "12-A, Indiranagar",
        area: "100 Feet Road",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560038",
        country: "India"
    },
    coordinates: {
        // Update these coordinates to your exact restaurant location
        lat: 12.9784,
        lng: 77.6408
    },
    contact: {
        phone: "+91 98765 43210",
        email: "info@dishdash.com",
        whatsapp: "+91 98765 43210"
    },
    hours: {
        monday: { open: "10:00", close: "23:00" },
        tuesday: { open: "10:00", close: "23:00" },
        wednesday: { open: "10:00", close: "23:00" },
        thursday: { open: "10:00", close: "23:00" },
        friday: { open: "10:00", close: "23:30" },
        saturday: { open: "10:00", close: "23:30" },
        sunday: { open: "10:00", close: "23:00" }
    },
    services: {
        delivery: {
            available: true,
            radius: "5km",
            estimatedTime: "30-45 minutes"
        },
        parking: {
            available: true,
            type: "Free valet parking"
        },
        payments: ["Cash", "Cards", "UPI", "Digital Wallets"]
    }
};

// Utility functions
export const formatAddress = (address) => {
    return `${address.street}, ${address.area}, ${address.city}, ${address.state} ${address.pincode}, ${address.country}`;
};

export const getDirectionsUrl = (coordinates) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;
};

export const getMapEmbedUrl = (coordinates) => {
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.5!2d${coordinates.lng}!3d${coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2z${coordinates.lat}°N+${coordinates.lng}°E!5e0!3m2!1sen!2sin!4v${Date.now()}`;
};

export const isRestaurantOpen = (hours) => {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const todayHours = hours[currentDay];

    if (!todayHours) return false;

    const currentTimeStr = now.toTimeString().substring(0, 5);
    return currentTimeStr >= todayHours.open && currentTimeStr <= todayHours.close;
};
