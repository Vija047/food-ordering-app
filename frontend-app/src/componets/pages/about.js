import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

function About() {
  const appVersion = "1.0.0";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div style={{ backgroundColor: '#fef7ed', minHeight: '100vh' }}>
      <motion.div
        className="container py-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div
          className="text-center mb-5"
          variants={itemVariants}
        >
          <div 
            className="badge text-uppercase fw-bold mb-3 px-3 py-2"
            style={{ 
              backgroundColor: '#f59e0b',
              color: '#ffffff',
              fontSize: '0.75rem',
              letterSpacing: '1px'
            }}
          >
            ABOUT DISHDASH
          </div>
          <h1 
            className="fw-bold mb-4"
            style={{ 
              fontSize: '3.5rem',
              color: '#1f2937',
              lineHeight: '1.2'
            }}
          >
            Your Go-To <span style={{ color: '#f59e0b' }}>Food</span> Destination
          </h1>
          <p 
            className="lead"
            style={{ 
              color: '#6b7280',
              fontSize: '1.2rem',
              maxWidth: '700px',
              margin: '0 auto'
            }}
          >
            Experience seamless food ordering with premium quality ingredients, 
            contactless delivery, and exceptional service in just 30 minutes.
          </p>
        </motion.div>

        {/* Main About Section */}
        <motion.div
          className="row align-items-center mb-5"
          variants={itemVariants}
        >
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="position-relative">
              <motion.img
                src="https://static.vecteezy.com/system/resources/thumbnails/040/210/257/small/ai-generated-a-plate-of-delicious-enchiladas-with-taco-sauce-colorful-mexican-food-photo.jpeg"
                alt="Delicious Food"
                className="img-fluid rounded-4 shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              />
              <div 
                className="position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill shadow-sm"
                style={{ 
                  backgroundColor: '#f59e0b',
                  color: '#ffffff'
                }}
              >
                <i className="fas fa-heart me-2"></i>
                <span className="fw-semibold">Made with Love</span>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="ps-lg-4">
              <h2 
                className="fw-bold mb-4"
                style={{ 
                  color: '#1f2937',
                  fontSize: '2.5rem'
                }}
              >
                Why Choose <span style={{ color: '#f59e0b' }}>DishDash?</span>
              </h2>
              <p 
                className="mb-4"
                style={{ 
                  color: '#6b7280',
                  fontSize: '1.1rem',
                  lineHeight: '1.7'
                }}
              >
                DishDash revolutionizes food ordering with cutting-edge technology, 
                premium ingredients, and lightning-fast delivery. From street food to 
                fine dining, we bring the best culinary experiences to your doorstep.
              </p>
              
              <div className="row g-3">
                {[
                  { icon: 'fas fa-bolt', title: 'Lightning Fast', desc: 'Order in seconds, delivered in 30 minutes' },
                  { icon: 'fas fa-shield-alt', title: 'Secure & Safe', desc: 'Contactless delivery with safety protocols' },
                  { icon: 'fas fa-star', title: 'Premium Quality', desc: 'Top-rated restaurants and fresh ingredients' },
                  { icon: 'fas fa-mobile-alt', title: 'Easy Tracking', desc: 'Real-time order tracking and updates' }
                ].map((feature, index) => (
                  <div key={index} className="col-sm-6">
                    <motion.div 
                      className="d-flex align-items-start p-3 rounded-3 h-100"
                      style={{ backgroundColor: '#ffffff' }}
                      whileHover={{ 
                        scale: 1.02,
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <div 
                        className="rounded-circle p-2 me-3"
                        style={{ 
                          backgroundColor: '#fef3c7',
                          minWidth: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <i 
                          className={feature.icon}
                          style={{ color: '#f59e0b', fontSize: '0.9rem' }}
                        ></i>
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-1" style={{ color: '#1f2937' }}>
                          {feature.title}
                        </h6>
                        <p className="mb-0 small" style={{ color: '#6b7280' }}>
                          {feature.desc}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          className="text-center mb-5"
          variants={itemVariants}
        >
          <h2 
            className="fw-bold mb-4"
            style={{ 
              color: '#1f2937',
              fontSize: '2.5rem'
            }}
          >
            How It <span style={{ color: '#f59e0b' }}>Works</span>
          </h2>
          <p 
            className="lead mb-5"
            style={{ 
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto 3rem auto'
            }}
          >
            Three simple steps to get your favorite food delivered to your doorstep
          </p>
          
          <div className="row g-4">
            {[
              { 
                icon: 'fas fa-search', 
                title: 'Browse & Choose', 
                desc: 'Explore our curated selection of premium restaurants and dishes',
                step: '01'
              },
              { 
                icon: 'fas fa-credit-card', 
                title: 'Secure Payment', 
                desc: 'Multiple payment options including UPI, cards, and digital wallets',
                step: '02'
              },
              { 
                icon: 'fas fa-shipping-fast', 
                title: 'Fast Delivery', 
                desc: 'Track your order in real-time and enjoy fresh food in 30 minutes',
                step: '03'
              }
            ].map((step, index) => (
              <div key={index} className="col-lg-4">
                <motion.div
                  className="card border-0 shadow-sm h-100 rounded-4"
                  style={{ backgroundColor: '#ffffff' }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card-body p-4 text-center">
                    <div className="position-relative mb-4">
                      <div 
                        className="rounded-circle mx-auto p-4"
                        style={{ 
                          backgroundColor: '#fef3c7',
                          width: '80px',
                          height: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <i 
                          className={step.icon}
                          style={{ color: '#f59e0b', fontSize: '1.8rem' }}
                        ></i>
                      </div>
                      <div 
                        className="position-absolute top-0 end-0 rounded-circle fw-bold"
                        style={{ 
                          backgroundColor: '#f59e0b',
                          color: '#ffffff',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem'
                        }}
                      >
                        {step.step}
                      </div>
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#1f2937' }}>
                      {step.title}
                    </h4>
                    <p className="text-muted mb-0">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Customer Reviews Section */}
        <motion.div
          className="mb-5"
          variants={itemVariants}
        >
          <div className="text-center mb-5">
            <h2 
              className="fw-bold mb-4"
              style={{ 
                color: '#1f2937',
                fontSize: '2.5rem'
              }}
            >
              What Our <span style={{ color: '#f59e0b' }}>Customers</span> Say
            </h2>
            <div className="d-flex justify-content-center align-items-center mb-4">
              <div className="me-3">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="fas fa-star" style={{ color: '#f59e0b' }}></i>
                ))}
              </div>
              <span className="fw-semibold" style={{ color: '#1f2937' }}>4.8/5 Rating</span>
            </div>
          </div>
          
          <div className="row g-4">
            {[
              {
                text: "DishDash has completely transformed my food ordering experience. The delivery is always on time and the food quality is exceptional!",
                name: "Priya Krishnan",
                role: "Food Blogger",
                rating: 5
              },
              {
                text: "The user interface is incredibly intuitive and the real-time tracking feature is fantastic. Best food delivery app I've used!",
                name: "Rahul Mehta",
                role: "Software Engineer",
                rating: 5
              },
              {
                text: "The variety of restaurants and the quality of service is outstanding. DishDash has become my go-to for all food cravings.",
                name: "Sneha Desai",
                role: "Marketing Manager",
                rating: 5
              }
            ].map((review, index) => (
              <div key={index} className="col-lg-4">
                <motion.div
                  className="card border-0 shadow-sm h-100 rounded-4"
                  style={{ backgroundColor: '#ffffff' }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card-body p-4">
                    <div className="d-flex mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <i key={i} className="fas fa-star me-1" style={{ color: '#f59e0b' }}></i>
                      ))}
                    </div>
                    <p className="mb-4" style={{ color: '#6b7280', fontStyle: 'italic' }}>
                      "{review.text}"
                    </p>
                    <div className="d-flex align-items-center">
                      <div 
                        className="rounded-circle me-3"
                        style={{ 
                          backgroundColor: '#f59e0b',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <span className="fw-bold text-white">
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h6 className="fw-semibold mb-0" style={{ color: '#1f2937' }}>
                          {review.name}
                        </h6>
                        <small style={{ color: '#6b7280' }}>
                          {review.role}
                        </small>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact & Support Section */}
        <motion.div
          className="text-center"
          variants={itemVariants}
        >
          <div 
            className="card border-0 shadow-lg rounded-4"
            style={{ backgroundColor: '#ffffff' }}
          >
            <div className="card-body p-5">
              <h2 
                className="fw-bold mb-4"
                style={{ 
                  color: '#1f2937',
                  fontSize: '2.5rem'
                }}
              >
                Need <span style={{ color: '#f59e0b' }}>Help?</span>
              </h2>
              <p 
                className="lead mb-4"
                style={{ color: '#6b7280' }}
              >
                Our customer support team is available 24/7 to assist you with any queries or concerns.
              </p>
              
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="d-flex align-items-center justify-content-center">
                    <div 
                      className="rounded-circle p-3 me-3"
                      style={{ 
                        backgroundColor: '#fef3c7',
                        minWidth: '50px'
                      }}
                    >
                      <i className="fas fa-envelope" style={{ color: '#f59e0b' }}></i>
                    </div>
                    <div className="text-start">
                      <h6 className="fw-semibold mb-1" style={{ color: '#1f2937' }}>
                        Email Support
                      </h6>
                      <a 
                        href="mailto:support@dishdash.com"
                        className="text-decoration-none fw-semibold"
                        style={{ color: '#f59e0b' }}
                      >
                        support@dishdash.com
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center justify-content-center">
                    <div 
                      className="rounded-circle p-3 me-3"
                      style={{ 
                        backgroundColor: '#fef3c7',
                        minWidth: '50px'
                      }}
                    >
                      <i className="fas fa-phone" style={{ color: '#f59e0b' }}></i>
                    </div>
                    <div className="text-start">
                      <h6 className="fw-semibold mb-1" style={{ color: '#1f2937' }}>
                        Phone Support
                      </h6>
                      <a 
                        href="tel:+919876543210"
                        className="text-decoration-none fw-semibold"
                        style={{ color: '#f59e0b' }}
                      >
                        +91 98765 43210
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center align-items-center">
                <span className="me-3" style={{ color: '#6b7280' }}>App Version:</span>
                <span 
                  className="badge px-3 py-2 fw-semibold"
                  style={{ 
                    backgroundColor: '#f59e0b',
                    color: '#ffffff',
                    fontSize: '0.9rem'
                  }}
                >
                  v{appVersion}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Font Awesome CDN */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default About;