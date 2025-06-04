import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./componets/Navbar";
import Register from "./componets/pages/Register"
import Login from "./componets/pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Restaurant from "./componets/pages/Restaurant";
import Order from "./componets/pages/Orders";
import Menu from "./componets/pages/Menu";
import Profile from "./componets/pages/profile";
import Home from "./componets/pages/home";
import Loader from "./componets/loader";
import Cart from "./componets/pages/cart";
import About from "./componets/pages/about";
import Help from "./componets/help";
import Contact from "./componets/contact";
// import LocationTracker from "./componets/pages/Location";
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the delay as needed
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
       
        {/* <div className="container"> */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            {/* <div className="spinner-border text-#FFFF00" role="status"> */}
              <span className="visually-hidden">Loading...</span>
              <Loader/>
            {/* </div> */}
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/home" element={<Home />} />
            <Route path="/restaurant" element={<Restaurant />} />
         <Route path="/Register" element={<Register/>}/>
            <Route path="/order" element={<Order />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="/contact" element={<Contact />} />
            {/* <Route path="/location" element={<LocationTracker />} /> */}
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
