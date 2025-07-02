# Google Maps Integration for Restaurant Management Dashboard

This implementation adds an interactive Google Maps location picker to your restaurant management dashboard, allowing admins to select restaurant locations visually on a map.

## Features

✅ **Interactive Map Selection**: Click anywhere on the map to select a location  
✅ **Drag-and-Drop Markers**: Drag markers to fine-tune the location  
✅ **Reverse Geocoding**: Automatically fetch addresses from coordinates  
✅ **Address Search**: Search for addresses and navigate to them on the map  
✅ **Current Location**: Get user's current location with one click  
✅ **Responsive Design**: Works perfectly on desktop and mobile devices  
✅ **Real-time Coordinates**: Display latitude and longitude in real-time  
✅ **Toggle Visibility**: Switch between text input and map picker  

## Setup Instructions

### 1. Install Dependencies

The required package `@react-google-maps/api` has been installed automatically.

### 2. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API** (Required)
   - **Geocoding API** (Required for address lookup)
   - **Places API** (Optional, for enhanced search)
4. Create credentials (API Key)
5. (Optional) Restrict the API key to your domain for security

### 3. Configure Environment Variables

Update the `.env` file in your frontend-app folder:

```env
REACT_APP_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_GOOGLE_MAPS_API_KEY
REACT_APP_BACKEND_URL=http://localhost:7000
```

**Important**: Replace `YOUR_ACTUAL_GOOGLE_MAPS_API_KEY` with your real API key.

### 4. Backend Support (Optional Enhancement)

To fully utilize the coordinates data, you may want to update your backend to store latitude and longitude:

```javascript
// In your restaurant schema (Models/Restaurants.js)
const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number }
  },
  // ... other fields
});
```

## How It Works

### 1. Location Selection Process

1. **Text Input Mode**: Users can type addresses manually
2. **Map Mode**: Click "Select on Map" to open the interactive map
3. **Map Interaction**: 
   - Click anywhere to place a marker
   - Drag the marker to adjust position
   - Search for specific addresses
   - Use current location button

### 2. Data Flow

```
User clicks on map → Coordinates captured → Reverse geocoding → Address fetched → State updated → Form submission includes both address and coordinates
```

### 3. Component Structure

```
Restaurant.js (Main Component)
├── LocationPicker.js (Reusable Map Component)
├── LocationPicker.css (Styling)
└── Google Maps API Integration
```

## Component Props

### LocationPicker Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onLocationSelect` | Function | - | Callback when location is selected |
| `defaultLocation` | Object | `{lat: 12.9716, lng: 77.5946}` | Default center (Bangalore) |
| `currentAddress` | String | `''` | Current address value |
| `mapHeight` | String | `'400px'` | Map container height |

### Location Data Object

```javascript
{
  lat: 12.9716,           // Latitude
  lng: 77.5946,           // Longitude  
  address: "Full Address", // Formatted address from Google
  placeId: "ChIJ..."      // Google Place ID (optional)
}
```

## Usage Examples

### Basic Usage

```jsx
import LocationPicker from '../LocationPicker';

const [location, setLocation] = useState('');
const [coordinates, setCoordinates] = useState({lat: 12.9716, lng: 77.5946});

const handleLocationSelect = (locationData) => {
  setLocation(locationData.address);
  setCoordinates({
    lat: locationData.lat,
    lng: locationData.lng
  });
};

return (
  <LocationPicker
    onLocationSelect={handleLocationSelect}
    currentAddress={location}
    defaultLocation={coordinates}
    mapHeight="350px"
  />
);
```

### Advanced Usage with Validation

```jsx
const handleLocationSelect = (locationData) => {
  // Validate coordinates are within acceptable range
  if (locationData.lat >= -90 && locationData.lat <= 90 && 
      locationData.lng >= -180 && locationData.lng <= 180) {
    setLocation(locationData.address);
    setCoordinates({
      lat: locationData.lat,
      lng: locationData.lng
    });
    setError(''); // Clear any previous errors
  } else {
    setError('Invalid coordinates selected');
  }
};
```

## Styling Customization

The component uses Bootstrap classes and custom CSS. Key customization points:

```css
/* Map container styling */
.location-picker .map-container {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Custom marker styling */
.custom-marker {
  /* Your custom marker styles */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .location-picker .map-container {
    height: 300px !important;
  }
}
```

## API Quotas and Billing

### Free Tier Limits
- **Maps JavaScript API**: $200 free credit monthly (≈ 28,000 map loads)
- **Geocoding API**: $200 free credit monthly (≈ 40,000 requests)

### Cost Optimization Tips
1. **Restrict API Key**: Limit to your domain only
2. **Enable Billing Alerts**: Set up notifications for usage
3. **Cache Results**: Store frequently accessed addresses
4. **Lazy Loading**: Load maps only when needed

## Troubleshooting

### Common Issues

1. **Map not loading**
   - Check if API key is correctly set in `.env`
   - Verify Maps JavaScript API is enabled
   - Check browser console for errors

2. **Geocoding not working**
   - Ensure Geocoding API is enabled
   - Check API key permissions
   - Verify network connectivity

3. **"For development purposes only" watermark**
   - API key restrictions are too strict
   - Add your domain to allowed referrers

4. **Coordinates not updating**
   - Check if `onLocationSelect` callback is properly connected
   - Verify state management in parent component

### Debug Mode

Add this to your LocationPicker component for debugging:

```javascript
// Add to component for debugging
console.log('Current location:', selectedLocation);
console.log('Address:', address);
console.log('API Key present:', !!process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
```

## Security Best Practices

1. **API Key Security**:
   - Never commit API keys to version control
   - Use environment variables
   - Restrict API key to specific domains
   - Enable only required APIs

2. **Data Validation**:
   - Validate coordinates on both frontend and backend
   - Sanitize address inputs
   - Implement rate limiting for geocoding requests

## Future Enhancements

Potential improvements you can add:

1. **Places Autocomplete**: Enhanced address search
2. **Multiple Markers**: Support for multiple restaurant locations
3. **Clustering**: Group nearby restaurants on map view
4. **Custom Map Styles**: Match your brand colors
5. **Offline Support**: Cache frequently used locations
6. **Drawing Tools**: Define delivery areas on map

## Testing

Test the implementation with these scenarios:

- [ ] Click on different map locations
- [ ] Drag markers to new positions  
- [ ] Search for known addresses
- [ ] Use current location button
- [ ] Toggle between map and text input
- [ ] Test on mobile devices
- [ ] Verify coordinates are saved correctly
- [ ] Test with no internet connection

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Google Maps API key and enabled services
3. Test with a simple address like "New York, NY"
4. Ensure your API key has proper permissions

The implementation is now ready to use! The interactive map will enhance your restaurant management dashboard with precise location selection capabilities.
