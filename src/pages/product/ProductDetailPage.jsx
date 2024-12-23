// src/pages/ProductDetailPage.jsx

/**
 * ProductDetailPage 컴포넌트
 * 
 * 상품의 상세 정보를 표시하고 장바구니 추가 기능을 제공하는 페이지 컴포넌트입니다.
 * 
 * 주요 기능:
 * 1. 상품 상세 정보 조회 및 표시
 * 2. 상품 이미지 로딩 및 표시
 * 3. 옵션 선택 기능
 * 4. 총 금액 계산
 * 5. 장바구니 추가 기능
 * 
 * 상태 관리:
 * - product: 상품 상세 정보
 * - loading: 데이터 로딩 상태
 * - error: 에러 상태
 * - checkedState: 선택된 옵션 상태
 * - imageUrl: 상품 이미지 URL
 * - imageLoading: 이미지 로딩 상태
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  // URL 파라미터 및 네비게이션
  const { productId } = useParams();
  const navigate = useNavigate();
  
  // 상태 관리
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedState, setCheckedState] = useState({});
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);

  /**
   * 이미지 불러오기 함수
   * @param {string} imageUrl - 이미지 URL
   * @param {string} access - 접근 토큰
   * @returns {Promise<string|null>} 이미지 Blob URL 또는 null
   */
  const fetchImage = async (imageUrl, access) => {
    if (!imageUrl) return null;
    
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
      console.error('이미지 로딩 실패:', error);
      return null;
    }
  };

  // 상품 상세 정보 조회
  useEffect(() => {
    const fetchProductDetail = async () => {
      const access = localStorage.getItem('access');
      try {
        const response = await axios.get(`http://localhost:8080/products/${productId}`, {
          headers: {
            access: access,
          },
        });

        const data = response.data;
        setProduct(data);

        // 이미지 로딩
        if (data.imageUrl) {
          const url = await fetchImage(data.imageUrl, access);
          setImageUrl(url);
        }
        setImageLoading(false);

        // 옵션 선택 상태 초기화
        const initialCheckedState = {};
        data.options?.forEach(opt => {
          initialCheckedState[opt.optionName] = false;
        });
        setCheckedState(initialCheckedState);

        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
        setImageLoading(false);
      }
    };

    fetchProductDetail();

    // cleanup function
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [productId]);

  /**
   * 옵션 체크박스 변경 핸들러
   * @param {string} optionName - 변경된 옵션의 이름
   */
  const handleCheckboxChange = (optionName) => {
    setCheckedState(prev => ({
      ...prev,
      [optionName]: !prev[optionName]
    }));
  };

  /**
   * 현재 선택된 옵션 목록 반환
   * @returns {Array} 선택된 옵션 배열
   */
  const getSelectedOptions = () => {
    if (!product?.options) return [];
    return product.options.filter(opt => checkedState[opt.optionName]);
  };

  /**
   * 총 금액 계산 (기본 가격 + 선택된 옵션 가격)
   * @returns {number} 계산된 총 금액
   */
  const calculateTotalPrice = () => {
    if (!product) return 0;
    const basePrice = product.price;
    const optionsPrice = getSelectedOptions()
      .reduce((sum, opt) => sum + opt.optionPrice, 0);
    return basePrice + optionsPrice;
  };

  /**
   * 장바구니 추가 핸들러
   * - localStorage에 장바구니 정보 저장
   * - 동일 상품 및 옵션의 경우 수량 증가
   */
  const addToCart = () => {
    const selectedOptions = getSelectedOptions();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const cartItem = {
      productId: product.productId,
      productName: product.productName,
      price: product.price,
      quantity: 1,
      selectedOptions: selectedOptions,
      totalPrice: calculateTotalPrice()
    };

    // 동일 상품 및 옵션 확인
    const existingItemIndex = cart.findIndex(item => 
      item.productId === product.productId && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (existingItemIndex >= 0) {
      // 기존 아이템 수량 증가
      cart[existingItemIndex].quantity += 1;
      cart[existingItemIndex].totalPrice = cart[existingItemIndex].quantity * calculateTotalPrice();
    } else {
      // 새 아이템 추가
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('장바구니에 추가되었습니다.');
    navigate('/product');
  };

  // 로딩 및 에러 상태 처리
  if (loading) return <div className="loading-state">로딩 중...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!product) return <div className="not-found-state">상품을 찾을 수 없습니다.</div>;

  return (
    <div className="container">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate('/product')}
        className="back-button"
        aria-label="상품 목록으로 돌아가기"
      >
        ← 목록으로
      </button>

      {/* 상품 상세 카드 */}
      <div className="product-detail-card">
        {/* 왼쪽: 상품 이미지 섹션 */}
        <div className="product-image-section">
          {imageLoading ? (
            <div className="product-image-placeholder loading">
              <span>이미지 로딩중...</span>
            </div>
          ) : imageUrl ? (
            <img
              src={imageUrl}
              alt={product.productName}
              className="product-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : (
            <div className="product-image-placeholder">
              <span>이미지 없음</span>
            </div>
          )}
        </div>

        {/* 오른쪽: 상품 정보 섹션 */}
        <div className="product-info-section">
          {/* 상품 기본 정보 */}
          <div>
            <h1 className="product-title">{product.productName}</h1>
            <p className="base-price">{product.price.toLocaleString()}원</p>
          </div>
          
          {/* 옵션 선택 섹션 */}
          {product.options?.length > 0 && (
            <div className="options-section">
              <h2 className="options-title">옵션 선택</h2>
              {product.options.map((option) => (
                <div 
                  key={option.optionName} 
                  className="option-item"
                >
                  <label className="option-label">
                    <input
                      type="checkbox"
                      checked={checkedState[option.optionName] || false}
                      onChange={() => handleCheckboxChange(option.optionName)}
                      className="option-checkbox"
                    />
                    <span className="option-name">{option.optionName}</span>
                    <span className="option-price">
                      {option.optionPrice > 0 
                        ? `+${option.optionPrice.toLocaleString()}원` 
                        : '무료'}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* 선택된 옵션 표시 */}
          {getSelectedOptions().length > 0 && (
            <div className="selected-options-section">
              <h3 className="selected-options-title">선택된 옵션</h3>
              {getSelectedOptions().map((option) => (
                <div key={option.optionName} className="selected-option-item">
                  • {option.optionName}
                  {option.optionPrice > 0 && ` (+${option.optionPrice.toLocaleString()}원)`}
                </div>
              ))}
            </div>
          )}

          {/* 총 금액 및 장바구니 버튼 */}
          <div className="total-section">
            <h3 className="total-title">총 금액</h3>
            <p className="total-price">
              {calculateTotalPrice().toLocaleString()}원
            </p>
          </div>

          <button
            onClick={addToCart}
            className="add-cart-button"
            aria-label="장바구니에 상품 추가"
          >
            장바구니에 담기
          </button>
        </div>
      </div>
    </div>
  );
}