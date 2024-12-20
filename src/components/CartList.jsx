import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './CartList.css';

function CartList() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;

    const newCart = cartItems.map((item, i) => {
      if (i === index) {
        const basePrice = item.price + 
          (item.selectedOptions?.reduce((sum, opt) => sum + (opt.optionPrice || 0), 0) || 0);
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: basePrice * newQuantity
        };
      }
      return item;
    });

    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getTotalAmount = () => {
    return cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart">
        <p className="mb-4">장바구니가 비어있습니다.</p>
        <button
          onClick={() => navigate('/product')}
          className="back-button"
        >
          메뉴로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="cart-wrapper">
      <div className="cart-header">
        <h2>장바구니</h2>
        <button onClick={clearCart} className="cart-clear-btn">
          전체 삭제
        </button>
      </div>

      {cartItems.map((item, index) => (
        <div key={`${item.productId}-${index}`} className="cart-item">
          <div className="cart-item-header">
            <div>
              <h3 className="item-name">{item.productName}</h3>
              <p className="item-price">{item.price?.toLocaleString()}원</p>
              
              {/* Display selected options */}
              {item.selectedOptions?.length > 0 && (
                <div className="options-list">
                  {item.selectedOptions.map((option, optIndex) => (
                    <div key={optIndex} className="option-item">
                      + {option.optionName}
                      {option.optionPrice > 0 && ` (${option.optionPrice.toLocaleString()}원)`}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => removeItem(index)}
              className="remove-btn"
            >
              삭제
            </button>
          </div>

          <div className="quantity-controls">
            <button
              onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
              className="quantity-btn"
            >
              -
            </button>
            <span className="quantity-display">{item.quantity || 1}</span>
            <button
              onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
              className="quantity-btn"
            >
              +
            </button>
          </div>

          <div className="font-bold">
            {(item.totalPrice || 0).toLocaleString()}원
          </div>
        </div>
      ))}

      <div className="total-section">
        <div className="total-label">총 결제금액</div>
        <div className="total-amount">
          {getTotalAmount().toLocaleString()}원
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => navigate('/')}
          className="back-button"
        >
          계속 쇼핑하기
        </button>
      </div>
    </div>
  );
}

export default CartList;
