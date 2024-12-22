import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

// 용도에 맞게 수정하기
const Loading = <div>Loading....</div>

const MainPage = lazy(() => import("../pages/UserPages/MainPage"))

const SignupPage = lazy(() => import("../pages/UserPages/SignupPage"))

const ProductPage = lazy(() => import("../pages/ProductPage"))

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

    // 테스트 product 페이지 후에 변경
    {
        path: 'product',
        element: <Suspense fallback={Loading}><ProductPage/></Suspense>
    }



])

export default root