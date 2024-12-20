// src/router/root.jsx
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import ProductListPage from '../pages/ProductListPage';
import CartPage from '../pages/CartPage';
import ProductDetailPage from '../pages/ProductDetailPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<ProductListPage />} />
      <Route path="/product" element={<ProductListPage />} />
      <Route path="/product/:productId" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
    </>
  )
);

export default router;