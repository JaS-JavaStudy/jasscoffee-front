import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Loading = <div>Loading....</div>

const MainPage = lazy(() => import("../pages/MainPage"))

const SignupPage = lazy(() => import("../pages/UserPages/SignupPage"))

const ProductPage = lazy(() => import("../pages/ProductPage"))

const root = createBrowserRouter([
    {
        path: '',
        element: <Suspense fallback={Loading}><MainPage/></Suspense> 
    },
    {
        path: 'signup',
        element: <Suspense fallback={Loading}><SignupPage/></Suspense>
    },
    {
        path: 'product',
        element: <Suspense fallback={Loading}><ProductPage/></Suspense>
    }



])

export default root