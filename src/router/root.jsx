import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";

const ProductListPage = lazy(() => import("../pages/product/ProductListPage"));
const ProductDetailPage = lazy(() => import("../pages/product/ProductDetailPage"));

const Loading = <div>Loading....</div>;

// Lazy-loaded Pages
const LoginPage = lazy(() => import("../pages/user/LoginPage"));
const SignupPage = lazy(() => import("../pages/user/SignupPage"));
const MyPage = lazy(() => import("../pages/user/MyPage"));

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
    ],
  },
]);

export default root;
