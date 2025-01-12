import NotFound from '@/pages/not-found';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { PublicRoute } from './public-route';
import { BookingPage } from '@/pages/booking';
import { SAdminRoute } from './sadmin-route';

const SignInPage = lazy(() => import('@/pages/auth/signin'));
const PanelLayout = lazy(() => import('@/components/layout/panel-layout'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const ToursPage = lazy(() => import('@/pages/tours'));
const CustomersPage = lazy(() => import('@/pages/customers'));
const SettingsPage = lazy(() => import('@/pages/settings'));
const TourEditPage = lazy(() => import('@/pages/tours/edit-page'));
const TourCreatePage = lazy(() => import('@/pages/tours/create-page'));
const TourSchedulesPage = lazy(() => import('@/pages/tours/schedules-page'));
const UsersPage = lazy(() => import('@/pages/users'));
const DocsPage = lazy(() => import('@/pages/docs'));

export default function AppRouter() {
  const panelRoutes = [
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <PanelLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </PanelLayout>
        </ProtectedRoute>
      ),
      children: [
        {
          element: <DashboardPage />,
          index: true
        },
        {
          path: 'bookings',
          element: <BookingPage />
        },
        {
          path: 'tours',
          element: <ToursPage />
        },
        {
          path: 'tours/create',
          element: <TourCreatePage />
        },
        {
          path: 'tours/:tourId',
          element: <TourEditPage />
        },
        {
          path: 'tours/:tourId/schedules',
          element: <TourSchedulesPage />
        },
        {
          path: 'customers',
          element: <CustomersPage />
        },
        {
          path: 'settings',
          element: <SettingsPage />
        },
        {
          path: 'users',
          element: (
            <SAdminRoute>
              <UsersPage />
            </SAdminRoute>
          )
        },
        {
          path: 'docs/*',
          element: <DocsPage />
        }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/login',
      element: (
        <PublicRoute>
          <SignInPage />
        </PublicRoute>
      ),
      index: true
    },
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([...panelRoutes, ...publicRoutes]);

  return routes;
}
