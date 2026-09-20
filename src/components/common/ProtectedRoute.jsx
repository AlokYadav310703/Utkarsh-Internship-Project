import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (roles?.length && !roles.includes(user.role)) return <Navigate to="/" replace />;
  if (user.role === "STUDENT" && !user.isEmailVerified) {
    return <Navigate to={`/verify-email?email=${encodeURIComponent(user.email)}`} replace />;
  }
  return children;
}
