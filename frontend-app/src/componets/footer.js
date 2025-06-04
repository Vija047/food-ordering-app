import { FaFacebookF, FaTwitter, FaGoogle, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="my-5">
      <footer className="text-center text-black bg-indigo-700 py-6">
        <div className="container p-4">
          
          {/* Links Section */}
          <section className="mt-5">
            <div className="flex justify-center gap-10">
              <h6 className="uppercase font-bold">
                <a href="/about" className="text-black">About Us</a>
              </h6>
              <h6 className="uppercase font-bold">
                <a href="/help" className="text-black">Help</a>
              </h6>
              <h6 className="uppercase font-bold">
                <a href="/contact" className="text-black">Contact</a>
              </h6>
            </div>
          </section>

          <hr className="my-5 border-gray-400" />

          {/* Description Section */}
          <section className="mb-5">
            <div className="flex justify-center">
              <div className="max-w-2xl text-center">
                <p className="text-black">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt distinctio earum repellat quaerat
                  voluptatibus placeat nam, commodi optio pariatur est quia magnam eum harum corrupti dicta, aliquam
                  sequi voluptate quas.
                </p>
              </div>
            </div>
          </section>

          {/* Social Media Section */}
          <section className="flex flex-col items-center gap-3 mb-5">
            <h5 className="text-lg font-semibold">Follow Us on Social Media</h5>
            <div className="flex justify-center gap-6 text-center">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-black text-2xl">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="text-black text-2xl">
                <FaTwitter />
              </a>
              <a href="https://www.google.com/" target="_blank" rel="noopener noreferrer" className="text-black text-2xl">
                <FaGoogle />
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-black text-2xl">
                <FaInstagram />
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="text-black text-2xl">
                <FaLinkedin />
              </a>
              <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="text-black text-2xl">
                <FaYoutube />
              </a>
            </div>
          </section>

        </div>
      </footer>
    </div>
  );
};

export default Footer;
