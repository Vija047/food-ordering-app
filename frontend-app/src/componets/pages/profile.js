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
    <div className="d-flex">
      {/* Sidebar */}
      <div
        className={`bg-danger text-white p-3 transition-all ${
          isOpen ? "col-3" : "col-1"
        }`}
        style={{ minHeight: "100vh" }}
      >
        {/* Toggle Button */}
        <div className="d-flex justify-content-between">
          <button onClick={toggleSidebar} className="btn btn-link text-white p-0 fs-4">
            <FaBars />
          </button>
        </div>

        {/* Profile Section */}
        <div className="text-center my-4">
          <label htmlFor="profileImageUpload" className="cursor-pointer">
            <img
              src={imagePreview}
              alt="Profile"
              className="rounded-circle border border-white"
              style={{ width: "64px", height: "64px", objectFit: "cover" }}
            />
          </label>
          <input
            type="file"
            id="profileImageUpload"
            accept="image/*"
            className="d-none"
            onChange={handleImageUpload}
          />
          <h5 className="mt-2">{profile.name || "User Name"}</h5>
          <p className="small">{profile.email || "Email"}</p>
          <button
            className="btn btn-light text-danger btn-sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <FaEdit className="me-1" />
            {isEditing ? "Save" : "Edit Profile"}
          </button>
        </div>

        {/* Menu Items */}
        <ul className="list-unstyled mt-4">
          <li className="mb-3 d-flex align-items-center">
            <FaShoppingBag className="me-2" /> {isOpen && "Orders"}
          </li>
          <li className="mb-3 d-flex align-items-center">
            <FaStar className="me-2" /> {isOpen && "Reviews"}
          </li>
          <li className="mb-3 d-flex align-items-center">
            <FaMapMarkerAlt className="me-2" /> {isOpen && "Address"}
          </li>
          <li className="mb-3 d-flex align-items-center">
            <FaKey className="me-2" /> {isOpen && "Change Password"}
          </li>
          <li className="mb-3 d-flex align-items-center">
            <FaInfoCircle className="me-2" /> {isOpen && "About Us"}
          </li>
          <li className="mb-3 d-flex align-items-center">
            <FaEnvelope className="me-2" /> {isOpen && "Contact Us"}
          </li>
          <li className="mb-3 d-flex align-items-center">
            <FaLanguage className="me-2" /> {isOpen && "Languages"}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <h2>Welcome to Your Profile</h2>

        {isEditing && (
          <div className="mt-4">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                value={profile.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={profile.email}
                onChange={handleChange}
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Birthday</label>
              <input
                type="date"
                name="birthday"
                className="form-control"
                value={profile.birthday}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                className="form-control"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>

            <button
              className="btn btn-success"
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
