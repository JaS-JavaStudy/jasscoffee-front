import { useState, useEffect } from 'react'
import axios from 'axios'
import styles from '../payment/PaymentInfo.module.css'

const PaymentInfo = ({cart}) => {
  const [totalPrice, setTotalPrice ]= useState(0)
  const [imageUrls, setImageUrls] = useState({})

  // db 이미지 주소를 이용하여 이미지 가져오기
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


  // 총 금액 계산
  useEffect(() => {
    const total = cart.reduce((acc, v) => acc + v.totalPrice, 0);
    setTotalPrice(total);
  }, [cart]);

  // 총 금액 계산
  useEffect(() => {
    const total = cart.reduce((acc, v) => acc + v.totalPrice, 0);
    setTotalPrice(total);
  }, [cart]);

  useEffect(() => {
    const fetchImages = async () => {
      const access = localStorage.getItem('access');
      const urls = {};

      for (const product of cart) {
        if (product.imageUrl) {
          const imageUrl = await fetchImage(product.imageUrl, access);
          urls[product.productId] = imageUrl; // 상품 ID를 key로 저장
        }
      }

      setImageUrls(urls);
      console.log(imageUrls)
    };

    fetchImages();
  }, [cart]);

  return (
    <div className={styles.paymentInfoContainer}>
      <h3 className={styles.paymentTextJass}>주문 현황</h3>
      {/* cart 정보 render */}
      <div className={styles.paymentInfo}>
        <div>
          {cart.map((product) => (
            <div key={`product${product.productId}`} className={styles.paymentInfoItem}>
              {imageUrls[product.productId] ? (
                <img
                  src={imageUrls[product.productId]}
                  alt={`${product.productName} 이미지`}
                  className={styles.paymentInfoImg}
                />
              ) : (
                <div className={styles.paymentInfoImg}>
                  <i className={styles.paymentInfoIcon}>X</i>
                </div>
              )}
              <div>
                <span className={styles.paymentProductName}>
                  {product.productName} - {product.totalPrice}원
                </span>
                {product.selectedOptions.length > 0 && (
                  <div className={styles.paymentInfoOptions}>
                    <span>상품 옵션 :</span>
                    {product.selectedOptions.map((option, optionIdx) => (
                      <span key={`product${product.productId}-option${optionIdx}`} className={styles.paymentOption}>
                        {option.optionName} - {option.optionPrice}원
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className={styles.paymentTotal}>총 결제 금액: {totalPrice} 원</p>
      </div>
    </div>
  );
  
}

export default PaymentInfo