import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Box from "./components/Box";
import User from "./components/User";
import Admin from "./components/Admin";
import Track from "./components/Track";
import Register from "./components/Register";
import Signup from "./components/Signup";
import AdminDashboard from "./components/AdminDashboard";
import { FileEdit, Search } from "lucide-react";
import "./App.css";

function Home() {
  return (
    <div className="home-content">
      <div className="left-content">
        <h1 className="main-title">
          Smart Complaint
          <br />
          <span>Management System</span>
        </h1>
        <p className="sub-title">
          A seamless, transparent, and highly efficient platform for citizens to report local issues and track resolutions directly with municipal authorities.
        </p>
        <div className="button-group">
          <Link to="/register" className="btn-register">
            <FileEdit size={18} /> Register Complaint
          </Link>
          <Link to="/track" className="btn-track">
            <Search size={18} /> Track Complaint
          </Link> 
        </div>
      </div>
      <div className="right-content">
        <Box />
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user" element={<User />} />
        <Route path="/admin-login" element={<Admin />} />
        <Route path="/track" element={<Track />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;