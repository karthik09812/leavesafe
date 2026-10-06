import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Redirects to /login if the user is not logged in
export default function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
