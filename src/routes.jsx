import { createBrowserRouter } from "react-router-dom";
import PortalLayout from "./components/layout/PortalLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicHome from "./pages/PublicHome";
import AuthPage from "./pages/AuthPage";
import StudentDashboard from "./pages/StudentDashboard";
import ApplyPage from "./pages/ApplyPage";
import AdminDashboard from "./pages/AdminDashboard";
import HowToApply from "./components/HowToApply/HowToApply";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PortalLayout />,
    children: [
      { index: true, element: <PublicHome /> },
      { path: "login", element: <AuthPage mode="login" /> },
      { path: "register", element: <AuthPage mode="register" /> },
      { path: "verify-email", element: <AuthPage mode="verify" /> },
      { path: "forgot-password", element: <AuthPage mode="forgot" /> },
      { path: "how-to-apply", element: <HowToApply /> },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute roles={["STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "apply",
        element: (
          <ProtectedRoute roles={["STUDENT"]}>
            <ApplyPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute roles={["ADMIN", "SUPER_ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
