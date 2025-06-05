// ProtectedRoute.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { JSX, ReactNode } from 'react';
interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps): JSX.Element {
    const user = JSON.parse(localStorage.getItem("user") || "null");

  const navigate = useNavigate();

  useEffect(() => {
    if (requireAuth && !user) {
      navigate('/', { replace: true });
    } else if (!requireAuth && user) {
      navigate('/explore', { replace: true });
    }
  }, [user, requireAuth, navigate]);

  return <>{children}</>;
}

export default ProtectedRoute;
