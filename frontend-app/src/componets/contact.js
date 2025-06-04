import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

function Contact() {
  return (
    <motion.div
      className="container mt-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Header Section */}
      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="fw-bold text-dark">Get in Touch</h1>
        <p className="text-muted">Have a question? We'd love to hear from you!</p>
      </motion.div>

      {/* Contact Information */}
      <div className="row">
        <motion.div
          className="col-md-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-dark">Contact Information</h2>
          <ul className="list-group">
            {[
              { icon: "📞", text: "+91 98765 43210" },
              { icon: "📧", text: "contact@dishdash.com" },
              { icon: "📍", text: "Bangalore, India" },
              { icon: "⏰", text: "Mon-Sat: 9 AM - 8 PM" },
            ].map((contact, index) => (
              <motion.li
                key={index}
                className="list-group-item border-0"
                whileHover={{ scale: 1.05 }}
              >
                {contact.icon} {contact.text}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          className="col-md-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-dark">Send Us a Message</h2>
          <form className="p-3 shadow rounded">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" placeholder="Enter your name" />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Enter your email" />
            </div>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea className="form-control" rows="3" placeholder="Write your message"></textarea>
            </div>
            <motion.button
              type="submit"
              className="btn btn-dark w-100"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Send Message
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Social Media Links with Icons */}
      <motion.div
        className="text-center mt-5"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-dark">Follow Us</h2>
        <div className="d-flex justify-content-center gap-4">
          {[
            { icon: <FaFacebookF />, link: "https://www.facebook.com/" },
            { icon: <FaTwitter />, link: "https://twitter.com/" },
            { icon: <FaInstagram />, link: "https://www.instagram.com/" },
            { icon: <FaLinkedin />, link: "https://www.linkedin.com/" },
            { icon: <FaYoutube />, link: "https://www.youtube.com/" },
          ].map((social, index) => (
            <motion.a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none fs-3"
              style={{ color: "black" }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Contact;
