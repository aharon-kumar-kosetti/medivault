import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ allowedRole }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={`/login/${allowedRole}`} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  return <Outlet />;
}
