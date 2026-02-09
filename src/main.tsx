import '@/lib/errorReporter';
import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css'
import { HomePage } from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import MPMDashboard from '@/pages/dashboard/MPMDashboard'
import StaffDashboard from '@/pages/dashboard/StaffDashboard'
import BEMDashboard from '@/pages/dashboard/BEMDashboard'
import { useAuthStore } from '@/lib/auth-store'
const queryClient = new QueryClient();
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const user = useAuthStore(s => s.user);
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
const DashboardRouter = () => {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" />;
  switch(user.role) {
    case 'MPM': return <MPMDashboard />;
    case 'KEMAHASISWAAN': return <StaffDashboard />;
    case 'BEM': return <BEMDashboard />;
    default: return <Navigate to="/" />;
  }
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><DashboardRouter /></ProtectedRoute>,
    errorElement: <RouteErrorBoundary />,
  }
]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
)