/**
 * ProductDetailPage 컴포넌트
 * 
 * 상품의 상세 정보를 표시하고 장바구니 추가 기능을 제공하는 페이지 컴포넌트입니다.
 * 
 * 주요 기능:
 * 1. 상품 상세 정보 조회 및 표시
 * 2. 상품 이미지 로딩 및 표시
 * 3. 옵션별 수량 독립적 관리
 * 4. 총 금액 실시간 계산
 * 5. 장바구니 추가 및 상태 관리
 * 
 * 상태 구조:
 * - product: 상품 상세 정보 객체
 * - loading: 데이터 로딩 상태
 * - error: 에러 상태 메시지
 * - imageUrl: 상품 이미지 URL (blob URL)
 * - imageLoading: 이미지 로딩 상태
 * - optionQuantities: 각 옵션별 선택 수량 ({optionName: quantity})
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  // URL 파라미터와 네비게이션 설정
  const { productId } = useParams();
  const navigate = useNavigate();
  
  // 기본 상태 관리
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageLoading, setImageLoading] = useState(true);
  
  // 각 옵션별 수량 상태 관리 (optionName을 키로 사용)
  const [optionQuantities, setOptionQuantities] = useState({});

  /**
   * 이미지 불러오기 함수
   * 
   * @param {string} imageUrl - 서버의 이미지 경로
   * @param {string} access - 접근 토큰
   * @returns {Promise<string|null>} 이미지 Blob URL 또는 null
   * 
   * 주요 기능:
   * 1. 서버에서 이미지를 Blob 형태로 다운로드
   * 2. 이미지 타입 검증 (content-type 확인)
   * 3. Blob URL 생성 및 반환
   * 4. 캐시 방지를 위한 헤더 설정
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
        throw new Error('유효하지 않은 이미지 형식입니다');
      }

      const blob = new Blob([response.data], { type: contentType });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('이미지 로딩 실패:', error);
      return null;
    }
  };

  /**
   * 상품 상세 정보 조회 Effect
   * 
   * 주요 기능:
   * 1. 상품 정보 API 호출 및 데이터 설정
   * 2. 옵션 수량 상태 초기화
   * 3. 이미지 로딩 처리
   * 4. 에러 핸들링
   * 5. cleanup 시 Blob URL 해제
   * 
   * 의존성: productId가 변경될 때마다 실행
   */
  useEffect(() => {
    const fetchProductDetail = async () => {
      const access = localStorage.getItem('access');
      try {
        // 상품 정보 조회
        const response = await axios.get(`http://localhost:8080/products/${productId}`, {
          headers: { access }
        });
  
        const data = response.data;
        console.log('API Response Data:', data);
        
        setProduct(data);
        
        // 옵션 수량 초기화 - 각 옵션의 초기 수량을 0으로 설정
        if (data.options?.length > 0) {
          const initialQuantities = {};
          data.options.forEach(opt => {
            initialQuantities[opt.optionName] = 0;
          });
          setOptionQuantities(initialQuantities);
        }

        // 이미지 로딩 처리
        if (data.imageUrl) {
          const url = await fetchImage(data.imageUrl, access);
          setImageUrl(url);
        }
        setImageLoading(false);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
        setImageLoading(false);
      }
    };
  
    fetchProductDetail();

    // cleanup: 이미지 URL 메모리 해제
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [productId]);

  /**
   * 옵션 수량 변경 핸들러
   * 
   * @param {string} optionName - 변경할 옵션의 이름
   * @param {string} action - 변경 액션 ('INCREMENT' | 'DECREMENT')
   * 
   * 주요 기능:
   * 1. 옵션별 독립적인 수량 관리
   * 2. 증가/감소 동작 처리
   * 3. 음수 수량 방지 (최소값 0)
   * 
   * 최적화: useCallback을 통한 메모이제이션
   */
  const handleQuantityChange = useCallback((optionName, action) => {
    setOptionQuantities(prev => ({
      ...prev,
      [optionName]: action === 'INCREMENT' 
        ? (prev[optionName] || 0) + 1 
        : Math.max(0, (prev[optionName] || 0) - 1)
    }));
  }, []);

  /**
   * 선택된 옵션 목록 반환 함수
   * 
   * @returns {Array} 수량이 1 이상인 옵션들의 배열
   * 
   * 주요 기능:
   * 1. 현재 선택된 옵션 필터링 (수량 > 0)
   * 2. 선택된 옵션 목록 생성
   * 
   * 의존성: product, optionQuantities 상태 변경 시 재계산
   */
  const getSelectedOptions = useCallback(() => {
    if (!product?.options) return [];
    return product.options.filter(opt => optionQuantities[opt.optionName] > 0);
  }, [product, optionQuantities]);

  /**
   * 총 금액 계산 함수
   * 
   * @returns {number} 계산된 총 금액
   * 
   * 주요 기능:
   * 1. 기본 상품 가격 계산
   * 2. 선택된 옵션의 가격 계산 (옵션 가격 × 수량)
   * 3. 총 합계 계산
   * 
   * 최적화: useCallback을 통한 메모이제이션
   */
  const calculateTotalPrice = useCallback(() => {
    if (!product) return 0;
    
    const basePrice = product.price;
    const optionsPrice = product.options?.reduce((sum, opt) => {
      const quantity = optionQuantities[opt.optionName] || 0;
      return sum + (opt.optionPrice * quantity);
    }, 0) || 0;
    
    return basePrice + optionsPrice;
  }, [product, optionQuantities]);

  /**
   * 장바구니 추가 함수
   * 
   * 주요 기능:
   * 1. 선택된 옵션 유효성 검사
   * 2. 장바구니 데이터 구성
   * 3. 기존 장바구니와 병합
   *    - 동일 상품 확인
   *    - 옵션 수량 업데이트 또는 추가
   * 4. localStorage에 저장
   * 
   * 최적화: useCallback을 통한 메모이제이션
   */
  const addToCart = useCallback(() => {
    const selectedOptions = getSelectedOptions();
    if (selectedOptions.length === 0) {
      alert('최소 1개 이상의 옵션을 선택해주세요.');
      return;
    }

    // 장바구니 아이템 구성
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartItem = {
      productId: product.productId,
      productName: product.productName,
      price: product.price,
      imageUrl: product.imageUrl,
      selectedOptions: selectedOptions.map(opt => ({
        ...opt,
        quantity: optionQuantities[opt.optionName]
      })),
      totalPrice: calculateTotalPrice()
    };

    // 동일 상품 확인 및 옵션 병합
    const existingItemIndex = cart.findIndex(item => 
      item.productId === product.productId
    );

    if (existingItemIndex >= 0) {
      const existingItem = cart[existingItemIndex];
      
      // 각 옵션별로 수량 업데이트 또는 추가
      cartItem.selectedOptions.forEach(newOpt => {
        const existingOptIndex = existingItem.selectedOptions
          .findIndex(opt => opt.optionName === newOpt.optionName);
        
        if (existingOptIndex >= 0) {
          // 기존 옵션 수량 증가
          existingItem.selectedOptions[existingOptIndex].quantity += newOpt.quantity;
        } else {
          // 새 옵션 추가
          existingItem.selectedOptions.push(newOpt);
        }
      });
      
      // 총 금액 업데이트
      existingItem.totalPrice = calculateTotalPrice();
    } else {
      // 새 상품 추가
      cart.push(cartItem);
    }

    // 장바구니 저장 및 네비게이션
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('장바구니에 추가되었습니다.');
    navigate('/product');
  }, [product, optionQuantities, getSelectedOptions, calculateTotalPrice, navigate]);

  // 로딩 및 에러 상태 처리
  if (loading) return <div className="loading-state">로딩 중...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!product) return <div className="not-found-state">상품을 찾을 수 없습니다.</div>;

  // 메인 렌더링
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

      <div className="product-detail-card">
        {/* 상품 이미지 섹션 */}
        <div className="product-image-section">
          {imageLoading ? (
            <div className="product-image-placeholder loading">
              <span>이미지 로딩중...</span>
            </div>
          ) : imageUrl ? (
            <div className="product-image-wrapper">
              <img
                src={imageUrl}
                alt={product.productName}
                className="product-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            </div>
          ) : (
            <div className="product-image-placeholder">
              <span>이미지 없음</span>
            </div>
          )}
        </div>

        {/* 상품 정보 섹션 */}
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
                  <div className="option-info">
                    <span className="option-name">{option.optionName}</span>
                    <span className="option-price">
                      {option.optionPrice > 0 
                        ? `+${option.optionPrice.toLocaleString()}원` 
                        : '무료'}
                    </span>
                  </div>
                  <div className="quantity-controls">
                    <button
                      onClick={() => handleQuantityChange(option.optionName, 'DECREMENT')}
                      className="quantity-button"
                      disabled={!optionQuantities[option.optionName]}
                      aria-label="수량 감소"
                    >
                      -
                    </button>
                    <span className="quantity-display">
                      {optionQuantities[option.optionName] || 0}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(option.optionName, 'INCREMENT')}
                      className="quantity-button"
                      aria-label="수량 증가"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 선택된 옵션 표시 섹션 - 선택된 옵션이 있을 때만 표시 */}
          {getSelectedOptions().length > 0 && (
            <div className="selected-options-section">
              <h3 className="selected-options-title">선택된 옵션</h3>
              {getSelectedOptions().map((option) => (
                <div key={option.optionName} className="selected-option-item">
                  <span className="selected-option-name">
                    {option.optionName}
                    {option.optionPrice > 0 && 
                      ` (+${option.optionPrice.toLocaleString()}원)`}
                  </span>
                  <span className="selected-option-quantity">
                    {optionQuantities[option.optionName]}개
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* 총 금액 및 장바구니 버튼 섹션 */}
          <div className="total-section">
            <h3 className="total-title">총 금액</h3>
            <p className="total-price">
              {calculateTotalPrice().toLocaleString()}원
            </p>
          </div>

          {/* 장바구니 추가 버튼 - 옵션 선택 여부에 따라 활성화/비활성화 */}
          <button
            onClick={addToCart}
            className="add-cart-button"
            disabled={getSelectedOptions().length === 0}
            aria-label="장바구니에 상품 추가"
          >
            장바구니에 담기
          </button>
        </div>
      </div>
    </div>
  );
}