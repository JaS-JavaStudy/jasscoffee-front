import { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Layout from "../pages/Layout";

const ProductListPage = lazy(() => import("../pages/product/ProductListPage"));
const ProductDetailPage = lazy(() => import("../pages/product/ProductDetailPage"));

const Loading = <div>Loading....</div>;

// Lazy-loaded Pages
const LoginPage = lazy(() => import("../pages/user/LoginPage"));
const SignupPage = lazy(() => import("../pages/user/SignupPage"));
const MyPage = lazy(() => import("../pages/user/MyPage"));

// 12.23 [남희]
// Admin Pages
const AdminMain = lazy(() => import("../pages/adminPage/AdminMain"));
const MenuManagement = lazy(() => import("../pages/adminPage/MenuManagement"));

// Root Layout 컴포넌트
const RootLayout = () => {
  return (
    <div className="container-fluid">
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

const root = createBrowserRouter([
  {
    // 루트 라우트
    path: "/",
    // 가장 바깥을 Layout으로 감싸고,
    // 그 안에 자식 라우트(children)로 각 페이지를 매핑합니다.
    element: <Layout />,
    children: [
      {
        // index 라우트 (= "/") 
        index: true,
        element: (
          <Suspense fallback={Loading}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        // "/signup"
        path: "signup",
        element: (
          <Suspense fallback={Loading}>
            <SignupPage />
          </Suspense>
        ),
      },
      // 상품 리스트 페이지
      {
        path: "product",
        element: (
          <Suspense fallback={Loading}>
            <ProductListPage />
          </Suspense>
        ),
      },
      // 상품 상세 페이지
      {
        path: "product/:productId",
        element: (
          <Suspense fallback={Loading}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
      // 마이페이지
      {
        path: "mypage",
        element: (
          <Suspense fallback={Loading}>
            <MyPage />
          </Suspense>
        ),
      },
      // 관리자 페이지
      {
        path: "admin",
        element: <Suspense fallback={Loading}><AdminMain /></Suspense>,
      },
      {
          path: "admin/menu",
          element: <Suspense fallback={Loading}><MenuManagement /></Suspense>,
      },
    ],
  },
]);

export default root;