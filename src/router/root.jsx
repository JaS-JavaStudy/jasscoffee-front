import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

// 용도에 맞게 수정하기
const Loading = <div>Loading....</div>

const MainPage = lazy(() => import("../pages/UserPages/MainPage"))

const SignupPage = lazy(() => import("../pages/UserPages/SignupPage"))

const ProductPage = lazy(() => import("../pages/ProductPage")) // 이거 삭제 해줘

const ProductListPage = lazy(() => import("../pages/product/ProductListPage"));
const ProductDetailPage = lazy(() => import("../pages/product/ProductDetailPage"));

const root = createBrowserRouter([
    // 12-22 [희원] Feat: MainPage = 로그인(메인), SignupPage = 회원가입
    {
        path: '',
        element: <Suspense fallback={Loading}><MainPage/></Suspense> 
    },
    {
        path: 'signup',
        element: <Suspense fallback={Loading}><SignupPage/></Suspense>
    },

    // 테스트 product 페이지 후에 변경 // 이거 삭제 해줘
    {// 이거 삭제 해줘
        path: 'product',// 이거 삭제 해줘
        element: <Suspense fallback={Loading}><ProductPage/></Suspense> // 이거 삭제 해줘
    },// 이거 삭제 해줘

    // 상품 ##########################################################################
    // 상품 리스트 페이지
    {
        path: "product",
        element: <Suspense fallback={Loading}><ProductListPage /></Suspense>,
    },
    // 상품 상세 페이지
    {
        path: "product/:productId",
        element: <Suspense fallback={Loading}><ProductDetailPage /></Suspense>,
    },
    // 상품 ##########################################################################


])

export default root