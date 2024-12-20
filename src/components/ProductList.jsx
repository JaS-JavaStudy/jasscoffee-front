// src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './ProductList.css'

function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    fetch('http://localhost:8080/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('네트워크 응답이 올바르지 않습니다');
        }
        return response.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // unique 카테고리 추출
  const categories = ['ALL', ...new Set(products.map(p => p.category))];

  // 필터링 및 정렬 로직
  const filteredAndSortedProducts = products
    .filter(product => 
      selectedCategory === 'ALL' ? true : product.category === selectedCategory
    )
    .filter(product =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
        default:
          return a.productName.localeCompare(b.productName);
      }
    });

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;

  return (
    <div className="container py-4">
      {/* 검색 및 필터 영역 */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <input
            type="text"
            placeholder="메뉴 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control"
          />
        </div>
        
        <div className="col-md-4 mb-3">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select"
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
            className="form-select"
          >
            <option value="name">이름순</option>
            <option value="priceLow">가격 낮은순</option>
            <option value="priceHigh">가격 높은순</option>
          </select>
        </div>
      </div>

      {/* 상품 목록 */}
      <div className="row g-4">
        {filteredAndSortedProducts.map(product => (
          <div key={product.productId} className="col-md-6 col-lg-4">
            <div 
              onClick={() => navigate(`/product/${product.productId}`)}
              className="card h-100 shadow-sm cursor-pointer"
              style={{ cursor: 'pointer' }}
            >
              <div className="card h-100 shadow-sm">
                <div className="card-img-placeholder"></div>
                <div className="card-body">
                  <h5 className="card-title">{product.productName}</h5>
                  <p className="card-price">{product.price.toLocaleString()}원</p>
                  <span className="badge">
                    {product.category}
                  </span>
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