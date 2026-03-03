import { MemberProvider } from '@/integrations';
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import { ScrollToTop } from '@/lib/scroll-to-top';
import ErrorPage from '@/integrations/errorHandlers/ErrorPage';
import HomePage from '@/components/pages/HomePage';
import CustomersPage from '@/components/pages/CustomersPage';
import CustomerDetailPage from '@/components/pages/CustomerDetailPage';
import CohortsPage from '@/components/pages/CohortsPage';
import RequestAnalysisPage from '@/components/pages/RequestAnalysisPage';

// Layout component that includes ScrollToTop
function Layout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
        routeMetadata: {
          pageIdentifier: 'home',
        },
      },
      {
        path: "customers",
        element: <CustomersPage />,
        routeMetadata: {
          pageIdentifier: 'customers',
        },
      },
      {
        path: "customers/:id",
        element: <CustomerDetailPage />,
        routeMetadata: {
          pageIdentifier: 'customer-detail',
        },
      },
      {
        path: "cohorts",
        element: <CohortsPage />,
        routeMetadata: {
          pageIdentifier: 'cohorts',
        },
      },
      {
        path: "request-analysis",
        element: <RequestAnalysisPage />,
        routeMetadata: {
          pageIdentifier: 'request-analysis',
        },
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
], {
  basename: import.meta.env.BASE_NAME,
});

export default function AppRouter() {
  return (
    <MemberProvider>
      <RouterProvider router={router} />
    </MemberProvider>
  );
}
