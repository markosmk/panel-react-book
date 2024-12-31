import NotFound from '@/pages/not-found';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { PublicRoute } from './public-route';
import { BookingPage } from '@/pages/booking';

const SignInPage = lazy(() => import('@/pages/auth/signin'));
const PanelLayout = lazy(() => import('@/components/layout/panel-layout'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const ToursPage = lazy(() => import('@/pages/tours'));
const CustomersPage = lazy(() => import('@/pages/customers'));
const SettingsPage = lazy(() => import('@/pages/settings'));
const TourDetailPage = lazy(() => import('@/pages/tours/detail-page'));
const TourCreatePage = lazy(() => import('@/pages/tours/create-page'));
const TourSchedulesPage = lazy(() => import('@/pages/tours/schedules-page'));

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
          element: <TourDetailPage />
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
