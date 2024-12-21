// src/pages/CartPage.jsx

/**
 * CartPage 컴포넌트
 * 
 * 장바구니 페이지의 전체 레이아웃을 구성하는 페이지 컴포넌트입니다.
 * 네비게이션 바와 CartList 컴포넌트를 포함합니다.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import CartList from '../components/CartList';
import './CartPage.css';

export default function CartPage() {
  return (
    <div className="page-container">
      {/* 상단 네비게이션 바 */}
      <nav className="navbar navbar-light custom-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="navbar-brand">JASS COFFEE</Link>
        </div>
      </nav>
      
      {/* 메인 콘텐츠 영역 */}
      <main className="container mt-4">
        <CartList />
      </main>
    </div>
  );
}