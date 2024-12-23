/**
 * ProductListPage 컴포넌트
 * 
 * 상품 목록 페이지의 전체 레이아웃을 구성하는 페이지 컴포넌트입니다.
 * 네비게이션 바와 상품 목록을 포함합니다.
 */
import React, {useState} from 'react';
import ProductList from '../../components/product/ProductList';
import Modal from '../../components/cartlist/Modal';
import CartList from '../../components/cartlist/CartList';
import './ProductListPage.css';

export default function ProductListPage() {
  const [isCartModalOpen, setCartModalOpen] = useState(false);

  const openCartModal = () => setCartModalOpen(true);
  const closeCartModal = () => setCartModalOpen(false);

  return (
    <div className="page-wrapper">
      {/* 상단 네비게이션 바 */}
      <nav className="navbar navbar-light custom-navbar">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center w-100">
            <span className="navbar-brand">JASS COFFEE</span>
            <button 
              className="cart-button" 
              onClick={openCartModal}
              aria-label="장바구니 열기"
            >
              장바구니 보기
            </button>
          </div>
        </div>
      </nav>
      
      {/* 메인 콘텐츠 영역 */}
      <main className="container">
        <ProductList />
      </main>

      {/* 장바구니 모달 */}
      <Modal isOpen={isCartModalOpen} onClose={closeCartModal}>
        <CartList closeCartModal={closeCartModal}/>
      </Modal>
    </div>
  );
}