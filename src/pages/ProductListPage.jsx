// src/pages/ProductListPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';
import './ProductListPage.css';

export default function ProductListPage() {
  return (
    <div className="page-container bg-light min-vh-100">
      <nav className="navbar navbar-light custom-header">
        <div className="container">
          <span className="navbar-brand mb-0 h1">JASS COFFEE</span>
          <Link 
            to="/cart" 
            className="btn btn-outline-primary cart-button"
          >
            장바구니 보기
          </Link>
        </div>
      </nav>
      
      <div className="container mt-4">
        <ProductList />
      </div>
    </div>
  );
}