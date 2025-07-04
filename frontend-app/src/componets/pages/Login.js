import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formdata, setFormdata] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:7000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formdata.email,
          password: formdata.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Login failed");
      if (!data.token) throw new Error("Token not provided in response");

      const role = data.user?.role || "customer";

      localStorage.setItem("token", data.token);
      localStorage.setItem("usertype", role);

      setSuccess("Login Successful! 🎉");

      setTimeout(() => {
        if (role === "admin") {
          navigate("/restaurant");
        } else if (role === "restaurant_owner") {
          navigate("/restaurant-owner");
        } else if (role === "customer") {
          // Check if user came from cart or another page
          const redirectPath = localStorage.getItem('redirectAfterLogin') || '/home';
          localStorage.removeItem('redirectAfterLogin');
          navigate(redirectPath);
        } else {
          setError("Invalid role detected.");
        }
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#FFF9F4", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="row g-0">
                <div className="col-md-6 d-none d-md-block">
                  <div
                    style={{
                      background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1589302168068-964664d93dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "100%",
                    }}
                  >
                    <div className="d-flex flex-column justify-content-center align-items-center h-100 text-white p-4">
                      <div className="rounded-circle d-flex justify-content-center align-items-center mb-3" style={{ backgroundColor: "#FFA500", width: "80px", height: "80px" }}>
                        <span className="fs-3">30</span>
                      </div>
                      <h2 className="fs-1 fw-bold">Delivered in</h2>
                      <h2 className="fs-1 fw-bold" style={{ color: "#FFA500" }}>30 minutes.</h2>
                      <p className="text-center mt-3">Premium quality food at your doorstep</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="p-5">
                    <div className="text-center mb-4">
                      <h2 className="fw-bold" style={{ color: "#333" }}>Sign In</h2>
                      <p className="text-muted">Access your DishDash account</p>
                    </div>

                    {success && <div className="alert alert-success">{success}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleLogin}>
                      <div className="mb-4">
                        <label className="form-label fw-medium">Email Address</label>
                        <input
                          type="email"
                          className="form-control form-control-lg rounded-3 border-1"
                          style={{ backgroundColor: "#F9F9F9" }}
                          placeholder="Enter your email"
                          name="email"
                          value={formdata.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <div className="d-flex justify-content-between">
                          <label className="form-label fw-medium">Password</label>
                          <a href="#forgot" className="text-decoration-none" style={{ color: "#FFA500" }}>Forgot Password?</a>
                        </div>
                        <input
                          type="password"
                          className="form-control form-control-lg rounded-3 border-1"
                          style={{ backgroundColor: "#F9F9F9" }}
                          placeholder="Enter your password"
                          name="password"
                          value={formdata.password}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="form-check mb-4">
                        <input className="form-check-input" type="checkbox" id="rememberMe" />
                        <label className="form-check-label" htmlFor="rememberMe">Keep me signed in</label>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-lg w-100 rounded-pill fw-medium"
                        style={{ backgroundColor: "#FFA500", color: "white", padding: "12px" }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Signing in...
                          </span>
                        ) : "Sign In"}
                      </button>

                      <div className="text-center mt-4">
                        <p className="mb-0">
                          Don't have an account?{" "}
                          <button
                            type="button"
                            className="btn btn-link fw-medium p-0"
                            style={{ color: "#FFA500", textDecoration: "none" }}
                            onClick={() => navigate("/register")}
                          >
                            Register
                          </button>
                        </p>
                      </div>
                    </form>

                    <div className="text-center mt-4">
                      <p className="text-muted">Or sign in with</p>
                      <div className="d-flex justify-content-center gap-3">
                        <button className="btn btn-outline-secondary rounded-circle" style={{ width: "40px", height: "40px" }}>
                          <i className="bi bi-google"></i>
                        </button>
                        <button className="btn btn-outline-secondary rounded-circle" style={{ width: "40px", height: "40px" }}>
                          <i className="bi bi-facebook"></i>
                        </button>
                        <button className="btn btn-outline-secondary rounded-circle" style={{ width: "40px", height: "40px" }}>
                          <i className="bi bi-apple"></i>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
