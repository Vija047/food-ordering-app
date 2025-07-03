import { BrowserRouter as Router } from "react-router-dom";
import { useState, useEffect } from "react";
import  Navbar  from "./componets/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Loader from "./componets/loader";
import AppRoutes from "./AppRoutes";

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
          <AppRoutes />
        )}
      </div>
    </Router>
  );
}

export default App;
