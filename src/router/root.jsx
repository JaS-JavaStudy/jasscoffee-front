// src/router/root.js

import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../pages/RootLayout';  // 최상위 레이아웃(아래에서 만듦)
import ProtectedRoute from './ProtectedRoute';

// Lazy-loaded Pages
const ProductListPage = lazy(() => import('../pages/product/ProductListPage'));
const ProductDetailPage = lazy(() => import('../pages/product/ProductDetailPage'));
const PaymentPage = lazy(() => import('../pages/payment/PaymentPage'));

const Loading = <div>Loading....</div>;

// User Pages
const LoginPage = lazy(() => import('../pages/user/LoginPage'));
const SignupPage = lazy(() => import('../pages/user/SignupPage'));
const MyPage = lazy(() => import('../pages/user/MyPage'));

// Admin Pages
const AdminMain = lazy(() => import('../pages/adminPage/AdminMain'));
const MenuManagement = lazy(() => import('../pages/adminPage/MenuManagement'));
const Unauthorized = lazy(() => import('../pages/adminPage/Unauthorized'));
const NotFound = lazy(() => import('../pages/NotFoundPage'));

const root = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // 루트 레이아웃
    children: [
      {
        // "/" 접속 시(index 라우트) -> 로그인 페이지
        index: true,
        element: (
          <Suspense fallback={Loading}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={Loading}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'signup',
        element: (
          <Suspense fallback={Loading}>
            <SignupPage />
          </Suspense>
        ),
      },
      {
        path: 'product',
        element: (
          <Suspense fallback={Loading}>
            <ProductListPage />
          </Suspense>
        ),
      },
      {
        path: 'product/:productId',
        element: (
          <Suspense fallback={Loading}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'mypage',
        element: (
          <Suspense fallback={Loading}>
            <MyPage />
          </Suspense>
        ),
      },
      {
        path: 'admin',
        element: (
          <Suspense fallback={Loading}>
            <ProtectedRoute element={<AdminMain />} />
          </Suspense>
        ),
      },
      {
        path: 'admin/menu',
        element: (
          <Suspense fallback={Loading}>
            <ProtectedRoute element={<MenuManagement />} />
          </Suspense>
        ),
      },
      {
        path: 'payment',
        element: (
          <Suspense fallback={Loading}>
            <PaymentPage />
          </Suspense>
        ),
      },
      {
        path: 'unauthorized', // Unauthorized 라우트 추가
        element: <Unauthorized />,
      },

      {
        path: '*', // Unauthorized 라우트 추가
        element: <NotFound />,
      },
    ],
  },
]);

export default root;
