// Import Navigate component from react-router-dom
// Used to redirect users to another route
import { Navigate } from 'react-router-dom';

// Import custom authentication hook from AuthContext
// This provides authentication state across the app
import { useAuth } from '../../context/AuthContext';

// ProtectedRoute component
// Wraps around routes that require authentication
const ProtectedRoute = ({ children }) => {
  
  // Get authentication status from context
  const { isAuthenticated } = useAuth();

  // If user is NOT authenticated,
  // redirect them to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If user IS authenticated,
  // render the protected component
  return children;
};

// Export component for use in route configuration
export default ProtectedRoute;
