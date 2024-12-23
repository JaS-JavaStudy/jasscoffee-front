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
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.css'
import axios from 'axios';
import { getUser } from '../../apis/userapis/getuser';
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

  // 초기 데이터 로딩
  useEffect(() => {



    const checkUser = async () => {
      const isUser = await getUser()

      if (isUser == null) {
        alert("Login을 하셔야해요.")
        navigate('/')
      }
    }
    


    
    const fetchProducts = async () => {
      const access = localStorage.getItem('access'); // 로컬 스토리지에서 access 토큰 가져오기
      try {
        const response = await axios.get('http://localhost:8080/products', {
          headers: {
            access: access, // 헤더에 access 추가
          },
        });
        setProducts(response.data); // 가져온 데이터 상태에 저장
        setLoading(false);
      } catch (error) {
        setError(error.message || '알 수 없는 오류 발생'); // 오류 메시지 설정
        setLoading(false);
      }
    };
    checkUser()
    fetchProducts();
  }, []);

  // 고유한 카테고리 목록 생성
  const categories = ['ALL', ...new Set(products.map(p => p.category))];

  // 필터링 및 정렬 로직
  const filteredAndSortedProducts = products
    // 카테고리 필터링
    .filter(product => 
      selectedCategory === 'ALL' ? true : product.category === selectedCategory
    )
    // 검색어 필터링
    .filter(product =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    // 정렬 적용
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

  // 로딩/에러 상태 처리
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
            aria-label="카테고리 선택"
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
            aria-label="정렬 기준 선택"
          >
            <option value="name">이름순</option>
            <option value="priceLow">가격 낮은순</option>
            <option value="priceHigh">가격 높은순</option>
          </select>
        </div>
      </div>

      {/* 상품 그리드 목록 */}
      <div className="row g-4">
        {filteredAndSortedProducts.map(product => (
          <div key={product.productId} className="col-md-6 col-lg-4">
            <div 
              onClick={() => navigate(`/product/${product.productId}`)}
              className="product-card"
            >
              <div className="card h-100">
                <div className="card-img-placeholder"></div>
                <div className="card-body">
                  <h5 className="card-title">{product.productName}</h5>
                  <p className="card-price">{product.price.toLocaleString()}원</p>
                  <span className="category-badge">
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