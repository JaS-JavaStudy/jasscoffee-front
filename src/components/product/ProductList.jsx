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
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { getUser } from '../../apis/userapis/getuser';import ProductRegistrationModal from './ProductRegistrationModal';
import './ProductList.css';
import { isStaff } from '../../apis/userapis/isStaff'; // isStaff API import


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
  const [imageUrls, setImageUrls] = useState({}); // 이미지 URL 상태
  const [imageLoadingStates, setImageLoadingStates] = useState({}); // 이미지 로딩 상태
  // 관리자 상태 추가 12.23 현호
  const [isStaffStatus, setIsStaffStatus] = useState(false);

  // 이미지 로딩 상태 업데이트 함수
  const updateImageLoadingState = (productId, isLoading) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [productId]: isLoading
    }));
  };

  // 이미지 불러오기 함수
  const fetchImage = async (imageUrl, productId, access) => {
    if (!imageUrl) return null;
    
    updateImageLoadingState(productId, true);
    try {
      const response = await axios.get(`http://localhost:8080${imageUrl}`, {
        headers: {
          'access': access,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        responseType: 'blob'
      });
      
      // 이미지 타입 검증
      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.startsWith('image/')) {
        throw new Error('Invalid image content type');
      }

      const blob = new Blob([response.data], { type: contentType });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error(`이미지 로딩 실패 (상품 ID: ${productId}):`, error);
      return null;
    } finally {
      updateImageLoadingState(productId, false);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {

    const checkUser = async () => {
      const isUser = await getUser();
      const staffCheck = await isStaff(); // isStaff API 호출
    
      if (isUser == null) {
        alert("Login을 하셔야해요.");
        navigate('/');
      } else {
        setIsStaffStatus(staffCheck);
      }
    }
        
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
    checkUser()
    fetchProducts();
  }, []);

  // 이미지 로딩
  useEffect(() => {
    const loadImages = async () => {
      const access = localStorage.getItem('access');
      const urls = { ...imageUrls };
      
      for (const product of products) {
        if (product.imageUrl && !urls[product.productId]) {
          const url = await fetchImage(product.imageUrl, product.productId, access);
          if (url) {
            urls[product.productId] = url;
          }
        }
      }
      
      setImageUrls(urls);
    };

    if (products.length > 0) {
      loadImages();
    }

    // cleanup function
    return () => {
      Object.values(imageUrls).forEach(url => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
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

  if (loading) return <div className="loading-spinner">로딩 중...</div>;
  if (error) return <div className="error-message">에러 발생: {error}</div>;

  return (
    <div className="product-list-content py-4">
      {/* 검색 및 필터 컨트롤 영역 */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <input
            type="text"
            placeholder="메뉴 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control search-input"
          />
        </div>
        
        <div className="col-12 col-md-4">
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

        <div className="col-12 col-md-4">
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
        {isStaffStatus && (
          <div className="row mb-4">
            <div className="col">
              <Button variant="primary" onClick={() => setShowModal(true)}>
                상품 등록
              </Button>
            </div>
          </div>
        )}
      {/* 상품 등록 모달 */}
      <ProductRegistrationModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onProductAdded={handleProductAdded}
      />

      {/* 상품 그리드 목록 */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
        {filteredAndSortedProducts.map(product => (
          <div key={product.productId} className="col">
            <div 
              onClick={() => navigate(`/product/${product.productId}`)}
              className="product-card"
            >
              <div className="card h-100">
                <div className="card-img-container">
                  {imageLoadingStates[product.productId] ? (
                    <div className="loading-placeholder">이미지 로딩중...</div>
                  ) : imageUrls[product.productId] ? (
                    <img
                      src={imageUrls[product.productId]}
                      className="card-img-top"
                      alt={product.productName}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.classList.add('img-error');
                        e.target.parentElement.classList.add('img-error-container');
                      }}
                    />
                  ) : (
                    <div className="card-img-placeholder">
                      <span>이미지 없음</span>
                    </div>
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