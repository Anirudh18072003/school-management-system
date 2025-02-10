import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Install with `npm install jwt-decode`

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // Get stored role
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    // Token Expiry Check
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem("token"); // Remove expired token
      localStorage.removeItem("role");
      return <Navigate to="/" replace />;
    }

    // Role-Based Access Control
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/" replace state={{ from: location }} />;
    }
  } catch (error) {
    localStorage.removeItem("token"); // Remove if token is invalid
    localStorage.removeItem("role");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
