// src/components/CartList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <div className="text-center py-8">
        <p className="mb-4">장바구니가 비어있습니다.</p>
        <button
          onClick={() => navigate('/')}
          className="text-blue-500 hover:text-blue-600"
        >
          메뉴로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">장바구니</h2>
        <button
          onClick={clearCart}
          className="text-red-500 hover:text-red-600"
        >
          전체 삭제
        </button>
      </div>

      {cartItems.map((item, index) => (
        <div
          key={`${item.productId}-${index}`}
          className="border rounded-lg p-4 bg-white"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg">{item.productName}</h3>
              <p className="text-gray-600">{item.price?.toLocaleString()}원</p>
              
              {/* 선택된 옵션들 표시 */}
              {item.selectedOptions && item.selectedOptions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {item.selectedOptions.map((option, optIndex) => (
                    <div key={optIndex} className="text-sm text-gray-600">
                      + {option.optionName}
                      {option.optionPrice > 0 && 
                        ` (${option.optionPrice.toLocaleString()}원)`
                      }
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => removeItem(index)}
              className="text-red-500 hover:text-red-600"
            >
              삭제
            </button>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
                className="px-2 py-1 border rounded"
              >
                -
              </button>
              <span className="w-8 text-center">{item.quantity || 1}</span>
              <button
                onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
                className="px-2 py-1 border rounded"
              >
                +
              </button>
            </div>
            <div className="font-bold">
              {(item.totalPrice || 0).toLocaleString()}원
            </div>
          </div>
        </div>
      ))}

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">총 결제금액</span>
          <span className="text-xl font-bold">
            {getTotalAmount().toLocaleString()}원
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 text-blue-500 hover:text-blue-600"
        >
          계속 쇼핑하기
        </button>
      </div>
    </div>
  );
}

export default CartList;