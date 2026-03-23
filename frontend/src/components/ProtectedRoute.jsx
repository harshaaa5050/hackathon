const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true;
  // const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
