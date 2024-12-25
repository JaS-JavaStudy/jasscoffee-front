/**
 * CartList 컴포넌트
 * 
 * 장바구니 기능을 구현한 컴포넌트입니다.
 * 상품의 추가, 수량 조절, 삭제 및 전체 금액 계산 기능을 제공합니다.
 * 
 * 주요 기능:
 * 1. 장바구니 상품 목록 표시
 * 2. 상품 수량 조절
 * 3. 개별/전체 상품 삭제
 * 4. 총 결제 금액 계산
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../cartlist/CartList.module.css';

function CartList({closeCartModal}) {
  // 상태 및 네비게이션 관리
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // 초기 장바구니 데이터 로드
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  /**
   * 상품 수량 업데이트 함수
   * @param {number} index - 상품 인덱스
   * @param {number} newQuantity - 새로운 수량
   */
  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;

    const newCart = cartItems.map((item, i) => {
      if (i === index) {
        const basePrice = item.price + 
          (item.selectedOptions?.reduce((sum, opt) => sum + (opt.optionPrice*opt.quantity || 0), 0) || 0);
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

  /**
   * 개별 상품 제거 함수
   * @param {number} index - 제거할 상품의 인덱스
   */
  const removeItem = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index);
    setCartItems(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  /**
   * 장바구니 전체 비우기 함수
   */
  const clearCart = () => {
    if (window.confirm('장바구니를 비우시겠습니까?')) {
      setCartItems([]);
      localStorage.removeItem('cart');
    }
  };

  /**
   * 총 결제 금액 계산 함수
   * @returns {number} 총 결제 금액
   */
  const getTotalAmount = () => {
    return cartItems.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  // 빈 장바구니 상태 처리
  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <p className={styles.emptyMessage}>장바구니가 비어있습니다.</p>
        <button
          onClick={closeCartModal}
          className={styles.continueShoppingButton}
        >
          메뉴로 돌아가기
        </button>
      </div>
    );
  }

  // 주문 페이지 이동
  const goPayment = () =>{
    closeCartModal();
    navigate('/payment')
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartHeader}>
        <h2 className={styles.cartTitle}>장바구니</h2>
        <button onClick={clearCart} className={styles.clearButton} aria-label="장바구니 비우기">
          전체 삭제
        </button>
      </div>

      <div className={styles.cartItems}>
        {cartItems.map((item, index) => (
          <div key={`${item.productId}-${index}`} className={styles.cartItem}>
            <div className={styles.itemHeader}>
              <div className={styles.itemInfo}>
                <h3 className={styles.itemTitle}>{item.productName}</h3>
                <p className={styles.itemPrice}>{item.price?.toLocaleString()}원</p>
                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <div className={styles.itemOptions}>
                    {item.selectedOptions.map((option, optIndex) => (
                      <div key={optIndex} className={styles.optionItem}>
                        + {option.optionName}
                        {option.optionPrice > 0 && ` (${option.optionPrice.toLocaleString()}원)`} + {option.quantity}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => removeItem(index)}
                className={styles.removeButton}
                aria-label={`${item.productName} 삭제`}
              >
                ❌
              </button>
            </div>
            <div className={styles.itemFooter}>
              <div className={styles.quantityControls}>
                <button
                  onClick={() => updateQuantity(index, (item.quantity || 1) - 1)}
                  className={styles.quantityButton}
                  aria-label="수량 감소"
                >
                  -
                </button>
                <span className={styles.quantityDisplay} aria-label="현재 수량">
                  {item.quantity || 1}
                </span>
                <button
                  onClick={() => updateQuantity(index, (item.quantity || 1) + 1)}
                  className={styles.quantityButton}
                  aria-label="수량 증가"
                >
                  +
                </button>
              </div>
              <div className={styles.itemTotal}>{(item.totalPrice || 0).toLocaleString()}원</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.totalSection}>
        <div className={styles.totalRow}>
          <span className={styles.totalLabel}>총 결제금액</span>
          <span className={styles.totalAmount}>{getTotalAmount().toLocaleString()}원</span>
        </div>
      </div>

      <div className={styles.cartActions}>
        <button onClick={closeCartModal} className={styles.continueShoppingButton}>
          계속 쇼핑하기
        </button>
        <button onClick={goPayment} className={styles.orderButton}>
          주문하기
        </button>
      </div>
    </div>
  );
};

export default CartList;