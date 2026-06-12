import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function RoleHomeRedirect() {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;

  const role = user?.role;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (role === 'seller') return <Navigate to="/seller" replace />;
  return <Navigate to="/buyer" replace />;
}

