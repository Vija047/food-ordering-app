import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sybol from "../assets/cutlery.ico";
import Cart from "../assets/icart.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

function Navbar() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(!user);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || user) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:7000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch user");
        return res.json();
      })
      .then(data => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const updateUser = () => setUser(JSON.parse(localStorage.getItem("user")) || null);
    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
    window.dispatchEvent(new Event("storage"));
  };

  const handleToggle = () => {
    const canvas = document.getElementById("offcanvasMenu");
    if (canvas) new bootstrap.Offcanvas(canvas).toggle();
  };

  return (
    <>
      <nav
        className={`navbar sticky-top ${isScrolled ? "shadow-sm bg-white" : "bg-transparent"}`}
        style={{
          transition: "all 0.3s ease",
          backdropFilter: isScrolled ? "blur(10px)" : "none",
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
        }}
      >
        <div className="container d-flex justify-content-between align-items-center">
          <a href="/" className="d-flex align-items-center text-decoration-none">
            <img src={Sybol} alt="Logo" width={36} height={36} />
            <span className="ms-2 fw-bold fs-4 text-warning">DishDash</span>
          </a>

          <ul className="navbar-nav d-none d-lg-flex flex-row gap-4">
            {["home", "menu", "order", "location"].map((page) => (
              <li key={page} className="nav-item">
                <a className="nav-link fw-medium" href={`/${page}`}>
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </a>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <div className="d-none d-md-flex align-items-center">
              {loading ? (
                <div className="spinner-border spinner-border-sm text-warning" role="status" />
              ) : user ? (
                <div className="d-flex align-items-center gap-2">
                  <div className="bg-warning rounded-circle text-white fw-bold d-flex justify-content-center align-items-center" style={{ width: 40, height: 40 }}>
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="d-none d-lg-block">
                    <p className="mb-0 fw-medium" style={{ fontSize: "14px" }}>{user.name}</p>
                    <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>{user.email}</p>
                  </div>
                  <button className="btn btn-outline-danger rounded-pill px-3 py-1 ms-2" onClick={handleLogout}>
                    Sign Out
                  </button>
                </div>
              ) : (
                <button className="btn btn-outline-warning rounded-pill px-3 py-1" onClick={() => navigate("/login")}>
                  Sign In
                </button>
              )}
            </div>

            <button
              className="btn position-relative p-2"
              onClick={() => navigate("/cart")}
              style={{ backgroundColor: "#FFF8E1", borderRadius: "12px" }}
            >
              <img src={Cart} alt="Cart" width={24} height={24} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark">
                1<span className="visually-hidden">items in cart</span>
              </span>
            </button>

            <button
              className="btn p-2 d-lg-none"
              onClick={handleToggle}
              style={{ backgroundColor: "#FFF8E1", borderRadius: "12px" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="#FF9800" viewBox="0 0 16 16">
                <path d="M2.5 12a.5.5 0 010-1h11a.5.5 0 010 1H2.5zm0-4a.5.5 0 010-1h11a.5.5 0 010 1H2.5zm0-4a.5.5 0 010-1h11a.5.5 0 010 1H2.5z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Offcanvas Menu */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="offcanvasMenu"
        aria-labelledby="offcanvasMenuLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasMenuLabel">Menu</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <ul className="navbar-nav gap-2">
            {["home", "menu", "order", "location"].map((page) => (
              <li key={page} className="nav-item">
                <a className="nav-link fw-medium" href={`/${page}`}>
                  {page.charAt(0).toUpperCase() + page.slice(1)}
                </a>
              </li>
            ))}
            <li className="nav-item mt-3">
              {user ? (
                <button onClick={handleLogout} className="btn btn-outline-danger w-100"> Sign Out</button>
              ) : (
                <button onClick={() => navigate("/login")} className="btn btn-warning w-100">Login</button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Navbar;
