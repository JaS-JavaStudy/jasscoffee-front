// router/routes.jsx
import { createBrowserRouter } from 'react-router-dom';
import Root from './root.jsx'
import AdminMain from '../pages/AdminMain';
import MenuManagement from '../pages/MenuManagement';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <AdminMain />,
      },
      {
        path: "menu",
        element: <MenuManagement />,
      },
    ],
  },
]);