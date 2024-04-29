import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import LoginForm from "./Components/Forms/LoginForm/LoginForm";
import RegistrationForm from "./Components/Forms/RegistrationForm/RegistrationForm";
import DashBoard from "./AdminDashboard/DashBoard";
import Navigation from "./Components/Navigation/Navigation";
import LandOwnerDetails from "./LandOwner/LandOwnerDetails";
import EditLandOwner from "./LandOwner/EditLandOwner";
import ArbsDetails from "./Arbs/ArbsDetails";
import ViewLandOwner from "./LandOwner/ViewLandOwner";

function App() {
  const [isLogin, setIsLogin] = useState(false);

  // Check if the user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
    }
  }, []);

  // Log the state whenever it changes
  useEffect(() => {
    // Check if user is already authenticated in localStorage
    const storedAuth = localStorage.getItem("isLogin");
    if (storedAuth === "true") {
      setIsLogin(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLogin(true);
    localStorage.setItem("isLogin", "true");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLogin"); // Remove the token from localStorage
    setIsLogin(false);
    console.log("User logged out");
  };

  return (
    <Router>
      <div className="App bg-[#496989] flex justify-center ">
        {/* Conditionally render Navigation based on isLogin */}
        {isLogin && <Navigation onLogout={handleLogout} />}
        <Routes>
          <Route path="/registration" element={<RegistrationForm />} />
          <Route path="/dashboard" element={<DashBoard />} />
          {!isLogin ? (
            <Route path="/" element={<LoginForm isLogin={handleLogin} />} />
          ) : (
            <>
              <Route path="/land-owner" element={<LandOwnerDetails />} />
              <Route path="/editLandOwner/:id" element={<EditLandOwner />} />
              {/* to ARB's */}
              <Route path="/LandOwner/Arbs/:id" element={<ArbsDetails />} />
              <Route path="/Arbs/:id" element={<ViewLandOwner />} />
            </>
          )}
          {/* Fallback route to redirect to login if URL doesn't match */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
