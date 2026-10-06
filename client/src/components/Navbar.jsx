import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand navbar-dark bg-primary px-3">
      <Link className="navbar-brand fw-bold" to="/">LeaveSafe</Link>
      <div className="navbar-nav ms-auto align-items-center">
        {user ? (
          <>
            <Link className="nav-link" to="/">Checklist</Link>
            <Link className="nav-link" to="/settings">Home Location</Link>
            <button className="btn btn-sm btn-outline-light ms-2" onClick={() => { logout(); navigate("/login"); }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="nav-link" to="/login">Login</Link>
            <Link className="nav-link" to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
