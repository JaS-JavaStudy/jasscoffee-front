// src/pages/ProductListPage.jsx

/**
 * ProductListPage 컴포넌트
 * 
 * 상품 목록 페이지의 전체 레이아웃을 구성하는 페이지 컴포넌트입니다.
 * 네비게이션 바와 상품 목록을 포함합니다.
 * 
 * 구성 요소:
 * 1. 네비게이션 바 (로고 및 장바구니 버튼)
 * 2. ProductList 컴포넌트
 */
import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';
import './ProductListPage.css';

export default function ProductListPage() {
  return (
    <div className="page-container">
      {/* 상단 네비게이션 바 */}
      <nav className="navbar navbar-light custom-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <span className="navbar-brand">JASS COFFEE</span>
          <Link 
            to="/cart" 
            className="cart-button"
            aria-label="장바구니로 이동"
          >
            장바구니 보기
          </Link>
        </div>
      </nav>
      
      {/* 메인 콘텐츠 영역 */}
      <main className="container mt-4">
        <ProductList />
      </main>
    </div>
  );
}