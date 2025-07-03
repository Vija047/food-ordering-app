// src/components/Location.js
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { restaurantData, getDirectionsUrl, getMapEmbedUrl, isRestaurantOpen } from "../../utils/restaurantData";

const Location = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);

  // Check if restaurant is currently open
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      setCurrentTime(now);
      setIsOpen(isRestaurantOpen(restaurantData.hours));
    };

    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-5" id="location" style={{ backgroundColor: '#fef7ed' }}>
      <div className="container">
        {/* Header Section */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            <h2 className="fw-bold mb-3" style={{ color: '#1f2937', fontSize: '2.5rem' }}>
              Visit Our Restaurant
            </h2>
            <p className="lead" style={{ color: '#6b7280' }}>
              {restaurantData.description}. We're open and ready to serve you!
            </p>
            <div className="d-inline-flex align-items-center px-3 py-2 rounded-pill"
              style={{ backgroundColor: isOpen ? '#10b981' : '#ef4444', color: 'white' }}>
              <i className={`fas ${isOpen ? 'fa-clock' : 'fa-clock'} me-2`}></i>
              <span className="fw-semibold">
                {isOpen ? 'Open Now' : 'Closed'} • {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        <div className="row g-4 align-items-center">
          {/* Map Section */}
          <div className="col-lg-7">
            <div
              className="position-relative shadow-lg rounded-4 overflow-hidden"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="ratio ratio-16x9">
                <iframe
                  title={`${restaurantData.name} Location`}
                  src={getMapEmbedUrl(restaurantData.coordinates)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              {/* Map Overlay Badge */}
              <div
                className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm"
                style={{
                  backgroundColor: '#f59e0b',
                  color: '#ffffff'
                }}
              >
                <i className="fas fa-map-marker-alt me-2"></i>
                <span className="fw-semibold">We're Here!</span>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="col-lg-5">
            <div className="ps-lg-4">
              <h3
                className="fw-bold mb-4"
                style={{
                  color: '#1f2937',
                  fontSize: '2rem'
                }}
              >
                {restaurantData.name}
              </h3>

              {/* Address Card */}
              <div
                className="card border-0 shadow-sm mb-4 rounded-3"
                style={{ backgroundColor: '#ffffff' }}
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-start">
                    <div
                      className="rounded-circle p-3 me-3"
                      style={{
                        backgroundColor: '#fef3c7',
                        minWidth: '50px'
                      }}
                    >
                      <i
                        className="fas fa-map-marker-alt"
                        style={{ color: '#f59e0b' }}
                      ></i>
                    </div>
                    <div>
                      <h5 className="fw-semibold mb-2" style={{ color: '#1f2937' }}>
                        Address
                      </h5>
                      <p className="mb-0" style={{ color: '#6b7280' }}>
                        {restaurantData.address.street}<br />
                        {restaurantData.address.area}<br />
                        {restaurantData.address.city}, {restaurantData.address.state} {restaurantData.address.pincode}<br />
                        {restaurantData.address.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info Cards */}
              <div className="row g-3 mb-4">
                <div className="col-sm-6">
                  <div
                    className="card border-0 shadow-sm h-100 rounded-3"
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <div className="card-body p-3 text-center">
                      <div
                        className="rounded-circle p-2 mx-auto mb-2"
                        style={{
                          backgroundColor: '#fef3c7',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <i
                          className="fas fa-phone"
                          style={{ color: '#f59e0b', fontSize: '0.9rem' }}
                        ></i>
                      </div>
                      <h6 className="fw-semibold mb-1" style={{ color: '#1f2937' }}>
                        Call Us
                      </h6>
                      <p className="mb-0 small" style={{ color: '#6b7280' }}>
                        {restaurantData.contact.phone}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div
                    className="card border-0 shadow-sm h-100 rounded-3"
                    style={{ backgroundColor: '#ffffff' }}
                  >
                    <div className="card-body p-3 text-center">
                      <div
                        className="rounded-circle p-2 mx-auto mb-2"
                        style={{
                          backgroundColor: '#fef3c7',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <i
                          className="fas fa-clock"
                          style={{ color: '#f59e0b', fontSize: '0.9rem' }}
                        ></i>
                      </div>
                      <h6 className="fw-semibold mb-1" style={{ color: '#1f2937' }}>
                        Hours
                      </h6>
                      <p className="mb-0 small" style={{ color: '#6b7280' }}>
                        {isOpen ? 'Open Now' : 'Closed'}<br />
                        10:00 AM - 11:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-3">
                <a
                  href={getDirectionsUrl(restaurantData.coordinates)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg fw-semibold text-white shadow-sm rounded-3 py-3"
                  style={{
                    backgroundColor: '#f59e0b',
                    border: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#d97706'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#f59e0b'}
                >
                  <i className="fas fa-directions me-2"></i>
                  Get Directions
                </a>

                <a
                  href={`tel:${restaurantData.contact.phone}`}
                  className="btn btn-lg fw-semibold rounded-3 py-3"
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid #10b981',
                    color: '#10b981',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#10b981';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#10b981';
                  }}
                >
                  <i className="fas fa-phone me-2"></i>
                  Call Now
                </a>

                <a
                  href={`https://wa.me/${restaurantData.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-lg fw-semibold rounded-3 py-3"
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid #f59e0b',
                    color: '#f59e0b',
                    transition: 'all 0.3s ease',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f59e0b';
                    e.target.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                    e.target.style.color = '#f59e0b';
                  }}
                >
                  <i className="fab fa-whatsapp me-2"></i>
                  WhatsApp Order
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Operating Hours & Additional Info Section */}
        <div className="row justify-content-center mt-5">
          <div className="col-lg-10">
            {/* Operating Hours */}
            <div
              className="card border-0 shadow-sm rounded-4 mb-4"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="card-body p-4 p-md-5">
                <h4 className="fw-bold mb-4 text-center" style={{ color: '#1f2937' }}>
                  Operating Hours
                </h4>
                <div className="row g-3">
                  {Object.entries(restaurantData.hours).map(([day, hours]) => (
                    <div key={day} className="col-md-6 col-lg-4">
                      <div className="d-flex justify-content-between align-items-center p-3 rounded-3"
                        style={{ backgroundColor: '#f9fafb' }}>
                        <span className="fw-semibold text-capitalize" style={{ color: '#1f2937' }}>
                          {day}
                        </span>
                        <span style={{ color: '#6b7280' }}>
                          {hours.open} - {hours.close}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Services */}
            <div
              className="card border-0 shadow-sm rounded-4"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="card-body p-4 p-md-5">
                <h4 className="fw-bold mb-4 text-center" style={{ color: '#1f2937' }}>
                  Our Services
                </h4>
                <div className="row g-4 text-center">
                  <div className="col-md-4">
                    <div
                      className="rounded-circle p-3 mx-auto mb-3"
                      style={{
                        backgroundColor: '#fef3c7',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i
                        className="fas fa-shipping-fast"
                        style={{ color: '#f59e0b', fontSize: '1.5rem' }}
                      ></i>
                    </div>
                    <h5 className="fw-semibold mb-2" style={{ color: '#1f2937' }}>
                      Fast Delivery
                    </h5>
                    <p className="mb-0 small" style={{ color: '#6b7280' }}>
                      Get your food delivered in just 30-45 minutes with our contactless delivery service within 5km radius.
                    </p>
                  </div>
                  <div className="col-md-4">
                    <div
                      className="rounded-circle p-3 mx-auto mb-3"
                      style={{
                        backgroundColor: '#fef3c7',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i
                        className="fas fa-parking"
                        style={{ color: '#f59e0b', fontSize: '1.5rem' }}
                      ></i>
                    </div>
                    <h5 className="fw-semibold mb-2" style={{ color: '#1f2937' }}>
                      Free Parking
                    </h5>
                    <p className="mb-0 small" style={{ color: '#6b7280' }}>
                      Complimentary valet parking available for all dine-in customers. Street parking also available.
                    </p>
                  </div>
                  <div className="col-md-4">
                    <div
                      className="rounded-circle p-3 mx-auto mb-3"
                      style={{
                        backgroundColor: '#fef3c7',
                        width: '60px',
                        height: '60px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i
                        className="fas fa-credit-card"
                        style={{ color: '#f59e0b', fontSize: '1.5rem' }}
                      ></i>
                    </div>
                    <h5 className="fw-semibold mb-2" style={{ color: '#1f2937' }}>
                      Multiple Payments
                    </h5>
                    <p className="mb-0 small" style={{ color: '#6b7280' }}>
                      Accept cash, cards, UPI, digital wallets. Online payment available for delivery orders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Font Awesome CDN - Add this to your index.html head section */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    </section>
  );
};

export default Location;