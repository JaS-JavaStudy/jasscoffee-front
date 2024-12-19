import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const Loading = <div>Loading....</div>

const MainPage = lazy(() => import("../pages/MainPage"))

const SignupIndex = lazy(() => import("../pages/UserPages/SignupPage"))

const LoginIndex = lazy(() => import("../pages/UserPages/LoginPage"))

const root = createBrowserRouter([
    {
        path: '',
        element: <Suspense fallback={Loading}><MainPage/></Suspense> 
    },
    {
        path: 'login',
        element: <Suspense fallback={Loading}><LoginIndex/></Suspense>
    },
    {
        path: 'signup',
        element: <Suspense fallback={Loading}><SignupIndex/></Suspense>
    },


])

export default root