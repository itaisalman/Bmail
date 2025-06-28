import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

// Component to check if the jwt is valid.
const ProtectedRoute = ({ children }) => {
  // null = loading, true = valid, false = not valid
  const [isAuth, setIsAuth] = useState(null);
  const token = sessionStorage.getItem("jwt");

  // Make an API request in order to check that jwt.
  // Only the server has the secret key.
  useEffect(() => {
    if (!token) {
      setIsAuth(false);
      return;
    }

    fetch("/api/auth/validate", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      })
      .catch(() => setIsAuth(false));
  }, [token]);

  if (isAuth === null) {
    return null;
  }

  if (!isAuth) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
