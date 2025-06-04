import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBars,
  FaShoppingBag,
  FaStar,
  FaMapMarkerAlt,
  FaKey,
  FaInfoCircle,
  FaEnvelope,
  FaLanguage,
  FaEdit,
} from "react-icons/fa";

const SidebarProfile = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    birthday: "",
    phone: "",
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState("/default-profile.png");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Unauthorized: Please log in.");
          return;
        }

        const response = await axios.get("http://localhost:7000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data) {
          setProfile({
            name: response.data.name || "",
            email: response.data.email || "",
            birthday: response.data.birthday || "",
            phone: response.data.phone || "",
            image: response.data.image || null,
          });

          setImagePreview(response.data.image || "/default-profile.png");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to load profile.");
      }
    };

    fetchUserData();
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, image: file });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-red-500 text-white h-screen p-5 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Hamburger Menu */}
        <div className="flex justify-between items-center">
          <button onClick={toggleSidebar} className="text-white text-2xl">
            <FaBars />
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex flex-col items-center my-5">
          <label htmlFor="profileImageUpload" className="cursor-pointer">
            <img
              src={imagePreview}
              alt="Profile"
              className="rounded-full w-16 h-16 border-2 border-white"
            />
          </label>
          <input
            type="file"
            id="profileImageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <h2 className="text-lg mt-2 font-semibold">
            {profile.name || "User Name"}
          </h2>
          <p className="text-sm opacity-80">{profile.email || "Email"}</p>
          <button
            className="mt-2 px-4 py-1 bg-white text-red-500 rounded-full text-sm flex items-center"
            onClick={() => setIsEditing(!isEditing)}
          >
            <FaEdit className="mr-1" /> {isEditing ? "Save" : "Edit Profile"}
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="mt-5 space-y-3">
          <li className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <FaShoppingBag />
            {isOpen && <span>Orders</span>}
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <FaStar />
            {isOpen && <span>Reviews</span>}
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <FaMapMarkerAlt />
            {isOpen && <span>Address</span>}
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <FaKey />
            {isOpen && <span>Change Password</span>}
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <FaInfoCircle />
            {isOpen && <span>About Us</span>}
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <FaEnvelope />
            {isOpen && <span>Contact Us</span>}
          </li>
          <li className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <FaLanguage />
            {isOpen && <span>Languages</span>}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5">
        <h1 className="text-xl font-semibold">Welcome to Your Profile</h1>

        {isEditing && (
          <div className="mt-4">
            <div className="mb-3">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                className="w-full p-2 border rounded"
                value={profile.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                className="w-full p-2 border rounded"
                value={profile.email}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Birthday</label>
              <input
                type="date"
                name="birthday"
                className="w-full p-2 border rounded"
                value={profile.birthday}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                className="w-full p-2 border rounded"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>

            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => setIsEditing(false)}
            >
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarProfile;
