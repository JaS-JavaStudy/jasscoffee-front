/**
 * ProductListPage 컴포넌트
 * 
 * 상품 목록 페이지의 전체 레이아웃을 구성하는 페이지 컴포넌트입니다.
 * 네비게이션 바와 상품 목록을 포함합니다.
 */
// import { Link } from 'react-router-dom';
import ProductList from '../../components/product/ProductList';
import styles from './ProductListPage.module.css';

import ProductCarousel from './ProductCarousel';

export default function ProductListPage() {
  return (
    <div className={styles.ProductListContainer}>
      {/* 메인 콘텐츠 영역 */}
      <div className={styles.ProductContainer}>
      <ProductCarousel />
        <ProductList />
      </div>
    </div>
  );
}