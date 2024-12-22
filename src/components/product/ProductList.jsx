// src/components/ProductList.jsx

/**
 * ProductList 컴포넌트
 * 
 * 상품 목록을 표시하고 검색, 필터링, 정렬 기능을 제공하는 컴포넌트입니다.
 * 
 * 주요 기능:
 * 1. 상품 데이터 fetch 및 상태 관리
 * 2. 검색어를 통한 상품 필터링
 * 3. 카테고리별 필터링
 * 4. 이름순/가격순 정렬
 * 5. 반응형 그리드 레이아웃
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './ProductList.css';
import axios from 'axios';
import ProductRegistrationModal from './ProductRegistrationModal';

function ProductList() {
  // 라우터 네비게이션 훅
  const navigate = useNavigate();
  
  // 상태 관리
  const [products, setProducts] = useState([]); // 전체 상품 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null);     // 에러 상태
  const [searchTerm, setSearchTerm] = useState(''); // 검색어
  const [selectedCategory, setSelectedCategory] = useState('ALL'); // 선택된 카테고리
  const [sortBy, setSortBy] = useState('name'); // 정렬 기준
  const [showModal, setShowModal] = useState(false);
  const [imageUrls, setImageUrls] = useState({}); // 이미지 URL 상태 추가

  // 이미지 불러오기 함수
  const fetchImage = async (imageUrl, access) => {
    try {
      const response = await axios.get(`http://localhost:8080${imageUrl}`, {
        headers: {
          'access': access,
        },
        responseType: 'blob'
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error('이미지 로딩 실패:', error);
      return null;
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    const fetchProducts = async () => {
      const access = localStorage.getItem('access');
      try {
        const response = await axios.get('http://localhost:8080/products', {
          headers: {
            'access': access,
          },
        });
        setProducts(response.data);
        
        setLoading(false);
      } catch (error) {
        setError(error.message || '알 수 없는 오류 발생');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 이미지 로딩
  useEffect(() => {
    const loadImages = async () => {
      const access = localStorage.getItem('access');
      const urls = {};
      
      for (const product of products) {
        if (product.imageUrl) {
          urls[product.productId] = await fetchImage(product.imageUrl, access);
        }
      }
      
      setImageUrls(urls);
    };

    if (products.length > 0) {
      loadImages();
    }

    // cleanup function
    return () => {
      // 이전 Blob URL들 해제
      Object.values(imageUrls).forEach(url => URL.revokeObjectURL(url));
    };
  }, [products]);

  // 상품 추가 후 목록 새로고침
  const handleProductAdded = async () => {
    const access = localStorage.getItem('access');
    try {
      const response = await axios.get('http://localhost:8080/products', {
        headers: {
          'access': access,
        },
      });
      setProducts(response.data);
      setShowModal(false);
    } catch (error) {
      console.error('상품 목록 새로고침 실패:', error);
    }
  };

  // 고유한 카테고리 목록 생성
  const categories = ['ALL', ...new Set(products.map(p => p.category))];

  // 필터링 및 정렬 로직
  const filteredAndSortedProducts = products
    .filter(product => selectedCategory === 'ALL' ? true : product.category === selectedCategory)
    .filter(product => product.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'priceLow': return a.price - b.price;
        case 'priceHigh': return b.price - a.price;
        default: return a.productName.localeCompare(b.productName);
      }
    });

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;

  return (
    <div className="container py-4">
      {/* 검색 및 필터 컨트롤 영역 */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <input
            type="text"
            placeholder="메뉴 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control search-input"
          />
        </div>
        
        <div className="col-md-4 mb-3">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select category-select"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="form-select sort-select"
          >
            <option value="name">이름순</option>
            <option value="priceLow">가격 낮은순</option>
            <option value="priceHigh">가격 높은순</option>
          </select>
        </div>
      </div>

      {/* 상품 등록 버튼 */}
      { (
        <div className="mb-4">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            상품 등록
          </Button>
        </div>
      )}

      {/* 상품 등록 모달 */}
      <ProductRegistrationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onProductAdded={handleProductAdded}
      />

      {/* 상품 그리드 목록 */}
      <div className="row g-4">
        {filteredAndSortedProducts.map(product => (
          <div key={product.productId} className="col-md-6 col-lg-4">
            <div 
              onClick={() => navigate(`/product/${product.productId}`)}
              className="product-card"
            >
              <div className="card h-100">
                <div className="card-img-container">
                  {imageUrls[product.productId] ? (
                    <img
                      src={imageUrls[product.productId]}
                      className="card-img-top"
                      alt={product.productName}
                    />
                  ) : (
                    <div className="card-img-placeholder"></div>
                  )}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{product.productName}</h5>
                  <p className="card-price">{product.price.toLocaleString()}원</p>
                  <span className="category-badge">{product.category}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;