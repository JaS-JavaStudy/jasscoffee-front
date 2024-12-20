// src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkedState, setCheckedState] = useState({});

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8080/products/${productId}`);
        if (!response.ok) throw new Error('상품을 불러올 수 없습니다.');
        const data = await response.json();
        setProduct(data);
        
        // Initialize checked state for each option
        const initialCheckedState = {};
        data.options?.forEach(opt => {
          initialCheckedState[opt.optionName] = false;
        });
        setCheckedState(initialCheckedState);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  const handleCheckboxChange = (optionName) => {
    setCheckedState(prev => ({
      ...prev,
      [optionName]: !prev[optionName]
    }));
  };

  const getSelectedOptions = () => {
    if (!product?.options) return [];
    return product.options.filter(opt => checkedState[opt.optionName]);
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    const basePrice = product.price;
    const optionsPrice = getSelectedOptions()
      .reduce((sum, opt) => sum + opt.optionPrice, 0);
    return basePrice + optionsPrice;
  };

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

    const existingItemIndex = cart.findIndex(item => 
      item.productId === product.productId && 
      JSON.stringify(item.selectedOptions) === JSON.stringify(selectedOptions)
    );

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += 1;
      cart[existingItemIndex].totalPrice = cart[existingItemIndex].quantity * calculateTotalPrice();
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('장바구니에 추가되었습니다.');
    navigate('/cart');
  };

  if (loading) return <div className="text-center py-8">로딩 중...</div>;
  if (error) return <div className="text-center py-8 text-danger">{error}</div>;
  if (!product) return <div className="text-center py-8">상품을 찾을 수 없습니다.</div>;

  return (
    <div className="container">
      <button
        onClick={() => navigate('/')}
        className="btn btn-link mb-4"
      >
        ← 목록으로
      </button>

      <div className="card shadow-lg p-4">
        <h1 className="card-title display-4 mb-4">{product.productName}</h1>
        <p className="text-muted mb-4">{product.price.toLocaleString()}원</p>
        
        {product.options?.length > 0 && (
          <div className="border-top border-bottom py-4 my-4">
            <h2 className="h5 mb-2">옵션 선택</h2>
            {product.options.map((option) => (
              <div 
                key={option.optionName} 
                className="d-flex justify-content-between py-2"
              >
                <label className="d-flex align-items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkedState[option.optionName] || false}
                    onChange={() => handleCheckboxChange(option.optionName)}
                    className="form-check-input"
                  />
                  <span>{option.optionName}</span>
                </label>
                <span>
                  {option.optionPrice > 0 
                    ? `+${option.optionPrice.toLocaleString()}원` 
                    : '무료'}
                </span>
              </div>
            ))}
          </div>
        )}

        {getSelectedOptions().length > 0 && (
          <div className="mt-4 p-3 bg-light rounded">
            <h3 className="h6 mb-2">선택된 옵션</h3>
            {getSelectedOptions().map((option) => (
              <div key={option.optionName} className="text-muted">
                • {option.optionName}
                {option.optionPrice > 0 && ` (+${option.optionPrice.toLocaleString()}원)`}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <h3 className="h5 mb-2">총 금액</h3>
          <p className="display-6">
            {calculateTotalPrice().toLocaleString()}원
          </p>
        </div>

        <button
          onClick={addToCart}
          className="btn btn-primary w-100 mt-4 py-3"
        >
          장바구니에 담기
        </button>
      </div>
    </div>
  );
}
