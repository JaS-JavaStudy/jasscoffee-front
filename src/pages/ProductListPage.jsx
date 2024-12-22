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
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';
import './ProductListPage.css';
import Modal from '../components/Modal'; // 남기추가
import CartList from '../components/CartList'; // 남기추가

export default function ProductListPage() {
  const [isCartModalOpen, setCartModalOpen] = useState(false); // 남기추가

  const openCartModal = () => setCartModalOpen(true); // 남기추가
  const closeCartModal = () => setCartModalOpen(false); // 남기추가

  return (
    <div className="page-container">
      {/* 상단 네비게이션 바 */}
      <nav className="navbar navbar-light custom-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <span className="navbar-brand">JASS COFFEE</span>
          <button 
            className="cart-button" 
            onClick={openCartModal}
            aria-label="장바구니 열기"
          >
            장바구니 보기
          </button>
        </div>
      </nav>
      
      {/* 메인 콘텐츠 영역 */}
      <main className="container mt-4">
        <ProductList />
      </main>
      {/* 장바구니 모달 남기추가가*/} 
      <Modal isOpen={isCartModalOpen} onClose={closeCartModal}>
        <CartList />
      </Modal>
    </div>
  );
}