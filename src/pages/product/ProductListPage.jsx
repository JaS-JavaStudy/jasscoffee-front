/**
 * ProductListPage 컴포넌트
 * 
 * 상품 목록 페이지의 전체 레이아웃을 구성하는 페이지 컴포넌트입니다.
 * 네비게이션 바와 상품 목록을 포함합니다.
 */
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../../components/product/ProductList';
import './ProductListPage.css';
import Modal from '../../components/cartlist/Modal'; // 남기추가
import CartList from '../../components/cartlist/CartList'; // 남기추가

export default function ProductListPage() {
  const [isCartModalOpen, setCartModalOpen] = useState(false);

  const openCartModal = () => setCartModalOpen(true); // 남기추가
  const closeCartModal = () => setCartModalOpen(false); // 남기추가

  return (
    <div className="page-container">
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