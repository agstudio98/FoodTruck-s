import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <p>Cargando...</p>;
  
  if (!user) {
    alert("Debes iniciar sesión para acceder a esta función 🛡️");
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;