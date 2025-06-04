import React, { useState } from "react";
import { Form, Button, Container, Card, Alert, Row, Col } from "react-bootstrap";
import { isStrongPassword } from "validator";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
    setSuccess("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formdata.name || !formdata.email || !formdata.password || !formdata.role) {
      setError("Please fill in all fields.");
      setIsLoading(false);
      return;
    }

    if (!isStrongPassword(formdata.password)) {
      setError("Password must be strong! (Use uppercase, lowercase, number, and special character)");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:7000/api/Register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration Successful! 🎉");
        setError("");
        setformdata({ name: "", email: "", password: "", role: "" });

        // Navigate to login page after successful registration
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        setError(data.message || "Registration failed!");
      }
    } catch (err) {
      setError("Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: "#FFF9F4",
      minHeight: "100vh",
      fontFamily: "'Poppins', sans-serif"
    }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={10}>
            <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
              <Row className="g-0">
                {/* Left side image */}
                <Col md={6} className="d-none d-md-block">
                  <div
                    style={{
                      background: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('https://images.unsplash.com/photo-1543353071-10c8ba85a904?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      height: "100%"
                    }}
                  >
                    <div className="d-flex flex-column justify-content-center align-items-center h-100 text-white p-4">
                      <h2 className="fs-1 fw-bold mb-3">Join</h2>
                      <h2 className="fs-1 fw-bold" style={{ color: "#FFA500" }}>DishDash</h2>
                      <p className="text-center mt-4">Create an account to enjoy delicious food delivered to your doorstep in 30 minutes.</p>
                    </div>
                  </div>
                </Col>

                {/* Form side */}
                <Col md={6}>
                  <div className="p-5">
                    <div className="text-center mb-4">
                      <h2 className="fw-bold" style={{ color: "#333" }}>Create Account</h2>
                      <p className="text-muted">Fill in your details to get started</p>
                    </div>

                    {success && <Alert variant="success" className="border-0 rounded-3">{success}</Alert>}
                    {error && <Alert variant="danger" className="border-0 rounded-3">{error}</Alert>}

                    <Form onSubmit={handleSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Full Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Enter your full name"
                          value={formdata.name}
                          onChange={handleChange}
                          required
                          className="form-control-lg rounded-3 border-1"
                          style={{ backgroundColor: "#F9F9F9" }}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formdata.email}
                          onChange={handleChange}
                          required
                          className="form-control-lg rounded-3 border-1"
                          style={{ backgroundColor: "#F9F9F9" }}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">Password</Form.Label>
                        <Form.Control
                          type="password"
                          name="password"
                          placeholder="Create a strong password"
                          value={formdata.password}
                          onChange={handleChange}
                          required
                          className="form-control-lg rounded-3 border-1"
                          style={{ backgroundColor: "#F9F9F9" }}
                        />
                        <Form.Text className="text-muted">
                          Use uppercase, lowercase, number, and special character
                        </Form.Text>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">I am a</Form.Label>
                        <Form.Select
                          name="role"
                          value={formdata.role}
                          onChange={handleChange}
                          required
                          className="form-control-lg rounded-3 border-1"
                          style={{ backgroundColor: "#F9F9F9" }}
                        >
                          <option value="">Select your role</option>
                          <option value="customer">Customer</option>
                          <option value="admin">Restaurant Owner</option>
                        </Form.Select>
                      </Form.Group>

                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 rounded-pill py-3 fw-medium"
                        style={{
                          backgroundColor: "#FFA500",
                          borderColor: "#FFA500"
                        }}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating Account...
                          </span>
                        ) : (
                          "Create Account"
                        )}
                      </Button>

                      <div className="text-center mt-4">
                        <p>
                          Already have an account?{" "}
                          <span
                            className="fw-medium"
                            style={{ color: "#FFA500", cursor: "pointer" }}
                            onClick={() => navigate("/login")}
                          >
                            Sign In
                          </span>
                        </p>
                      </div>
                    </Form>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;
