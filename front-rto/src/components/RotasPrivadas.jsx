import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoadingIndicator from './LoadingIndicator';

const RotaPrivada = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingIndicator fullHeight />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RotaPrivada;