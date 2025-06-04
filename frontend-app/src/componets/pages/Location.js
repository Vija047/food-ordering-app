import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = { lat: 16.4390, lng: 120.5880 }; // Example location

// Route points for the driver
const pathCoordinates = [
  { lat: 16.4505, lng: 120.5899 }, // Pickup point (Green)
  { lat: 16.4450, lng: 120.5900 }, // Midpoint (Purple)
  { lat: 16.4400, lng: 120.5850 }, // Destination (Red)
];

const TrackingMap = () => {
  const [driverLocation, setDriverLocation] = useState(pathCoordinates[0]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < pathCoordinates.length) {
        setDriverLocation(pathCoordinates[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 3000); // Updates every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap mapContainerStyle={mapContainerStyle} center={defaultCenter} zoom={14}>
        {/* Pickup Location (Green) */}
        <Marker position={pathCoordinates[0]} label="P" />

        {/* Midpoint (Purple) */}
        <Marker position={pathCoordinates[1]} label="M" />

        {/* Destination (Red) */}
        <Marker position={pathCoordinates[2]} label="D" />

        {/* Driver's Live Location (Moving) */}
        <Marker position={driverLocation} label="🚗" />

        {/* Path Line */}
        <Polyline path={pathCoordinates} options={{ strokeColor: "#0000FF", strokeWeight: 4 }} />
      </GoogleMap>

      <div style={{ textAlign: "center", marginTop: "10px" }}>
        <p>🚚 Driver is on the way to pick up your order!</p>
        <button 
          style={{
            padding: "10px 20px",
            backgroundColor: "#D32F2F",
            color: "#FFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          CONTACT DRIVER
        </button>
      </div>
    </LoadScript>
  );
};

export default TrackingMap;
