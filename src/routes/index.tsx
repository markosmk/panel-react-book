import NotFound from '@/pages/not-found';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
import { PublicRoute } from './public-route';
import { BookingPage } from '@/pages/booking';
import { RoleRoute } from './role-route';
import { Role } from '@/types/user.types';

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
const RolesPage = lazy(() => import('@/pages/roles'));
const DocsPage = lazy(() => import('@/pages/docs'));
const AdditionalPage = lazy(() => import('@/pages/additional'));
const BookingHistoryPage = lazy(() => import('@/pages/booking-history'));
const BookingCreatePage = lazy(() => import('@/pages/booking/create-page'));

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
          path: 'bookings/create',
          element: <BookingCreatePage />
        },

        {
          path: 'bookings/history',
          element: <BookingHistoryPage />
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
          path: 'additionals',
          element: <AdditionalPage />
        },
        {
          path: 'customers',
          element: <CustomersPage />
        },
        {
          path: 'settings',
          element: (
            // <RoleRoute allowedRoles={[Role.SUPERADMIN]}>
            <SettingsPage />
            // </RoleRoute>
          )
        },
        {
          path: 'users',
          element: (
            <RoleRoute allowedRoles={[Role.SUPERADMIN]}>
              <Suspense>
                <Outlet />
              </Suspense>
            </RoleRoute>
          ),
          children: [
            {
              index: true,
              element: <UsersPage />
            },
            {
              path: 'roles',
              element: <RolesPage />
            }
          ]
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
