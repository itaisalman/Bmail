import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("jwt");
  return token ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
