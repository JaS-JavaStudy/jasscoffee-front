import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/Layout";

const Loading = <div>Loading....</div>;

// Lazy-loaded Pages
const MainPage = lazy(() => import("../pages/UserPages/MainPage"));
const SignupPage = lazy(() => import("../pages/UserPages/SignupPage"));
const ProductPage = lazy(() => import("../pages/ProductPage"));
const MyPage = lazy(() => import("../pages/UserPages/MyPage"));

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
            <MainPage />
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
      {
        path: "product",
        element: (
          <Suspense fallback={Loading}>
            <ProductPage />
          </Suspense>
        ),
      },
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
