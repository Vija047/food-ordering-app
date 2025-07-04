import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-800 to-indigo-900 text-white py-12">
      <div className="container mx-auto px-4">
        {/* Links Section */}
        <section className="mb-12">
          <div className="flex justify-center gap-16">
            <h6 className="uppercase font-bold text-sm tracking-wider">
              <a 
                href="/about" 
                className="text-white hover:text-indigo-300 transition-colors duration-300 flex items-center gap-2"
              >
                About Us
              </a>
            </h6>
            <h6 className="uppercase font-bold text-sm tracking-wider">
              <a 
                href="/help" 
                className="text-white hover:text-indigo-300 transition-colors duration-300 flex items-center gap-2"
              >
                Help
              </a>
            </h6>
            <h6 className="uppercase font-bold text-sm tracking-wider">
              <a 
                href="/contact" 
                className="text-white hover:text-indigo-300 transition-colors duration-300 flex items-center gap-2"
              >
                Contact
              </a>
            </h6>
          </div>
        </section>

        <hr className="border-indigo-600 max-w-4xl mx-auto" />

        {/* Description Section */}
        <section className="my-12">
          <div className="flex justify-center">
            <div className="max-w-2xl text-center">
              <p className="text-gray-300 leading-relaxed">
                Welcome to our food ordering platform. We're passionate about connecting you with the best local restaurants 
                and delivering delicious meals right to your doorstep. Experience convenience, quality, and exceptional 
                service with every order.
              </p>
            </div>
          </div>
        </section>

        {/* Social Media Section */}
        <section className="flex flex-col items-center gap-6">
          <h5 className="text-xl font-semibold text-indigo-200">Connect With Us</h5>
          <div className="flex justify-center gap-8">
            <a 
              href="https://www.facebook.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-indigo-300 transition-transform hover:scale-125 duration-300 text-2xl"
            >
              <FaFacebookF />
            </a>
            <a 
              href="https://twitter.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-indigo-300 transition-transform hover:scale-125 duration-300 text-2xl"
            >
              <FaTwitter />
            </a>
            <a 
              href="https://www.google.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-indigo-300 transition-transform hover:scale-125 duration-300 text-2xl"
            >
              <FaGoogle />
            </a>
            <a 
              href="https://www.instagram.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-indigo-300 transition-transform hover:scale-125 duration-300 text-2xl"
            >
              <FaInstagram />
            </a>
            <a 
              href="https://www.linkedin.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-indigo-300 transition-transform hover:scale-125 duration-300 text-2xl"
            >
              <FaLinkedin />
            </a>
            <a 
              href="https://www.youtube.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-white hover:text-indigo-300 transition-transform hover:scale-125 duration-300 text-2xl"
            >
              <FaYoutube />
            </a>
          </div>
        </section>

        {/* Copyright Section */}
        <div className="text-center mt-12 text-sm text-indigo-200">
          <p>© {new Date().getFullYear()} Your Food Delivery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
