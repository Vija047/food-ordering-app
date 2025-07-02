import React, { useState } from 'react';
import LocationPicker from './LocationPicker';
import { MapPin, Save } from 'lucide-react';

/**
 * Demo component showing how to use LocationPicker independently
 * This is a standalone example you can use in any form
 */
const LocationPickerDemo = () => {
  const [selectedLocation, setSelectedLocation] = useState({
    address: '',
    coordinates: { lat: 12.9716, lng: 77.5946 } // Bangalore default
  });

  const handleLocationSelect = (locationData) => {
    setSelectedLocation({
      address: locationData.address,
      coordinates: {
        lat: locationData.lat,
        lng: locationData.lng
      }
    });
  };

  const handleSave = () => {
    console.log('Selected Location Data:', selectedLocation);
    alert(`Location saved!\nAddress: ${selectedLocation.address}\nCoordinates: ${selectedLocation.coordinates.lat}, ${selectedLocation.coordinates.lng}`);
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">
                <MapPin className="me-2" size={24} />
                Location Picker Demo
              </h4>
            </div>
            <div className="card-body">
              <LocationPicker
                onLocationSelect={handleLocationSelect}
                currentAddress={selectedLocation.address}
                defaultLocation={selectedLocation.coordinates}
                mapHeight="400px"
              />
              
              {selectedLocation.address && (
                <div className="mt-4">
                  <div className="alert alert-info">
                    <h6 className="mb-2">Selected Location Details:</h6>
                    <p className="mb-1"><strong>Address:</strong> {selectedLocation.address}</p>
                    <p className="mb-1"><strong>Latitude:</strong> {selectedLocation.coordinates.lat}</p>
                    <p className="mb-0"><strong>Longitude:</strong> {selectedLocation.coordinates.lng}</p>
                  </div>
                  
                  <button 
                    className="btn btn-success"
                    onClick={handleSave}
                  >
                    <Save className="me-2" size={16} />
                    Save Location
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPickerDemo;
