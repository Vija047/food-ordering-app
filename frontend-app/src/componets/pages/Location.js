// src/components/Location.js
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Location = () => {
  return (
    <section className="py-5" id="location" style={{ backgroundColor: '#fef7ed' }}>
      <div className="container">
        {/* Header Section */}
        <div className="row justify-content-center text-center mb-5">
          <div className="col-lg-8">
            
           
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
                  title="DishDash Restaurant Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.0!2d77.5946!3d12.9716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c6b9274b%3A0xc51e4c1c5b2e8b01!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1717915090407"
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
                Restaurant Details
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
                        123 MG Road, Brigade Road<br />
                        Bengaluru, Karnataka 560025<br />
                        India
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
                        +91 98765 43210
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
                        10 AM - 11 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-3">
                <a
                  href="https://maps.google.com/?q=12.9716,77.5946"
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
                
                <button
                  className="btn btn-lg fw-semibold rounded-3 py-3"
                  style={{ 
                    backgroundColor: 'transparent',
                    border: '2px solid #f59e0b',
                    color: '#f59e0b',
                    transition: 'all 0.3s ease'
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
                  <i className="fas fa-utensils me-2"></i>
                  Order Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="row justify-content-center mt-5">
          <div className="col-lg-10">
            <div 
              className="card border-0 shadow-sm rounded-4"
              style={{ backgroundColor: '#ffffff' }}
            >
              <div className="card-body p-4 p-md-5">
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
                      Get your food delivered in just 30 minutes with our contactless delivery service.
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
                      Complimentary parking available for all dine-in customers at our restaurant.
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
                        className="fas fa-shield-alt"
                        style={{ color: '#f59e0b', fontSize: '1.5rem' }}
                      ></i>
                    </div>
                    <h5 className="fw-semibold mb-2" style={{ color: '#1f2937' }}>
                      Safe Dining
                    </h5>
                    <p className="mb-0 small" style={{ color: '#6b7280' }}>
                      We follow all safety protocols to ensure a clean and safe dining experience.
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