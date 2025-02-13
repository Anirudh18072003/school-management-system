import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const location = useLocation();

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoading(false);
        return;
      }

      if (allowedRoles.includes(role)) {
        setIsAuthorized(true);
      }
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    }
    setIsLoading(false);
  }, [token, role, allowedRoles]);

  if (isLoading) {
    return <div className="text-center text-gray-600 mt-10">Loading...</div>;
  }

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: "Session expired. Please log in again." }}
      />
    );
  }

  if (!isAuthorized) {
    return <Navigate to="/access-denied" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
