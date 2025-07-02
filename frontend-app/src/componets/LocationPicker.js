import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { MapPin, Search, Navigation } from 'lucide-react';
import './LocationPicker.css';

const LocationPicker = ({ 
  onLocationSelect, 
  defaultLocation = { lat: 12.9716, lng: 77.5946 }, // Bangalore coordinates
  currentAddress = '',
  mapHeight = '400px'
}) => {
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [address, setAddress] = useState(currentAddress);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const mapRef = useRef(null);

  // Google Maps configuration
  const mapContainerStyle = {
    width: '100%',
    height: mapHeight,
    borderRadius: '8px',
    border: '1px solid #dee2e6'
  };

  const mapOptions = {
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: true,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };

  // Reverse geocoding function
  const reverseGeocode = useCallback(async (lat, lng) => {
    setIsLoading(true);
    setError('');
    
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await new Promise((resolve, reject) => {
        geocoder.geocode(
          { location: { lat, lng } },
          (results, status) => {
            if (status === 'OK' && results[0]) {
              resolve(results[0]);
            } else {
              reject(new Error('Geocoding failed'));
            }
          }
        );
      });

      const formattedAddress = response.formatted_address;
      setAddress(formattedAddress);
      
      // Call parent callback with location data
      if (onLocationSelect) {
        onLocationSelect({
          lat,
          lng,
          address: formattedAddress,
          placeId: response.place_id
        });
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
      setError('Failed to fetch address for this location');
    } finally {
      setIsLoading(false);
    }
  }, [onLocationSelect]);

  // Handle map click
  const handleMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setSelectedLocation({ lat, lng });
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  // Handle marker drag
  const handleMarkerDragEnd = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setSelectedLocation({ lat, lng });
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    setIsLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setSelectedLocation({ lat, lng });
        reverseGeocode(lat, lng);
        
        // Pan map to current location
        if (mapRef.current) {
          mapRef.current.panTo({ lat, lng });
          mapRef.current.setZoom(15);
        }
      },
      (err) => {
        console.error('Geolocation error:', err);
        setError('Failed to get current location');
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, [reverseGeocode]);

  // Search for address
  const searchAddress = useCallback((searchQuery) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError('');

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode(
      { address: searchQuery },
      (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          
          setSelectedLocation({ lat, lng });
          setAddress(results[0].formatted_address);
          
          // Pan map to searched location
          if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(15);
          }

          // Call parent callback
          if (onLocationSelect) {
            onLocationSelect({
              lat,
              lng,
              address: results[0].formatted_address,
              placeId: results[0].place_id
            });
          }
        } else {
          setError('Address not found');
        }
        setIsLoading(false);
      }
    );
  }, [onLocationSelect]);

  return (
    <div className="location-picker">
      {/* Address Display and Search */}
      <div className="mb-3">
        <label className="form-label fw-semibold">
          <MapPin className="me-2" size={16} />
          Selected Location
        </label>
        
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Search for an address or click on the map"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                searchAddress(address);
              }
            }}
          />
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => searchAddress(address)}
            disabled={isLoading}
            title="Search Address"
          >
            <Search size={16} />
          </button>
          <button
            type="button"
            className="btn btn-outline-success"
            onClick={getCurrentLocation}
            disabled={isLoading}
            title="Use Current Location"
          >
            <Navigation size={16} />
          </button>
        </div>

        {/* Coordinates Display */}
        <div className="d-flex gap-3 mb-2">
          <small className="text-muted">
            <strong>Lat:</strong> {selectedLocation.lat.toFixed(6)}
          </small>
          <small className="text-muted">
            <strong>Lng:</strong> {selectedLocation.lng.toFixed(6)}
          </small>
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-warning py-2 mb-2" role="alert">
            <small>{error}</small>
          </div>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="d-flex align-items-center mb-2">
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <small className="text-muted">Fetching location details...</small>
          </div>
        )}
      </div>

      {/* Google Map */}
      <div className="map-container">
        <LoadScript
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'}
          libraries={['places']}
        >
          <GoogleMap
            ref={mapRef}
            mapContainerStyle={mapContainerStyle}
            center={selectedLocation}
            zoom={13}
            options={mapOptions}
            onClick={handleMapClick}
          >
            <Marker
              position={selectedLocation}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
              title="Selected Location"
              icon={{
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 25 15 25s15-13.75 15-25c0-8.284-6.716-15-15-15z" fill="#dc3545"/>
                    <circle cx="15" cy="15" r="8" fill="white"/>
                    <circle cx="15" cy="15" r="4" fill="#dc3545"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(30, 40),
                anchor: new window.google.maps.Point(15, 40)
              }}
            />
          </GoogleMap>
        </LoadScript>
      </div>

      {/* Instructions */}
      <div className="mt-3">
        <small className="text-muted">
          <strong>Instructions:</strong> Click on the map to select a location, drag the marker to adjust, 
          or search for an address in the field above. You can also use your current location.
        </small>
      </div>
    </div>
  );
};

export default LocationPicker;
