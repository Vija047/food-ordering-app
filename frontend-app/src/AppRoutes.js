import { Routes, Route } from "react-router-dom";
import Register from "./componets/pages/Register";
import Login from "./componets/pages/Login";
import Restaurant from "./componets/admin/Restaurant";
import Order from "./componets/pages/Orders";
import Menu from "./componets/pages/Menu";
import Profile from "./componets/pages/profile";
import Home from "./componets/pages/home";
import Cart from "./componets/pages/cart";
import About from "./componets/pages/about";
import Help from "./componets/help";
import Contact from "./componets/contact";
import { Navbar } from "react-bootstrap";
import LocationTracker from "./componets/pages/Location";

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/restaurant" element={<Restaurant />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/order" element={<Order />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/about" element={<About />} />
        <Route path="/help" element={<Help />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/location" element={<LocationTracker />} />
      </Routes>
    </>
  );
}

export default AppRoutes;
