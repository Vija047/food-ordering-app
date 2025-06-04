import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";

function Help() {
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
        <h1 className="fw-bold text-dark">Need Help?</h1>
        
      </motion.div>

      {/* FAQ Section */}
      <div className="row">
        <motion.div
          className="col-md-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-dark">Frequently Asked Questions</h2>
          <motion.ul 
            className="list-group"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { question: "How do I place an order?", answer: "Simply browse our menu, add items to your cart, and proceed to checkout." },
              { question: "What payment methods do you accept?", answer: "We accept credit/debit cards, UPI, and cash on delivery." },
              { question: "Can I track my order?", answer: "Yes! You will receive real-time updates on your order status." },
              { question: "How can I contact customer support?", answer: "Reach out to us via email or call our 24/7 helpline." },
            ].map((faq, index) => (
              <motion.li
                key={index}
                className="list-group-item border-0"
                whileHover={{ scale: 1.05 }}
              >
                ❓ <strong>{faq.question}</strong>
                <br />
                {faq.answer}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          className="col-md-6"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
         
        
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Help;
