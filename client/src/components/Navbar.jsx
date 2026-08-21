import { Building2, LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-left">
        <div className="logo-container">
          <Building2 size={24} color="white" />
        </div>
        <div className="brand-text">
          <h2>Smart Complaint</h2>
          <span>Management System</span>
        </div>
      </Link>

      <div className="nav-center">
        <Link to="/">Home</Link>
        <Link to="/track">Track Complaint</Link>
        <Link to="/register">Register Issue</Link>
      </div>

      <div className="nav-right">
        <Link to="/user" className="login-btn user">
          <UserIcon size={16} /> User Login
        </Link>
        <Link to="/admin-login" className="login-btn admin">
          Admin <LogOut size={16} />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;