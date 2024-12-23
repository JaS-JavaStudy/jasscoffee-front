import React, { useState, useEffect } from 'react'
import './PaymentInfo.css'

const PaymentInfo = ({cart}) => {
  const [totalPrice, setTotalPrice ]= useState(0)
  // 총 금액 계산
  useEffect(() => {
    const total = cart.reduce((acc, v) => acc + v.totalPrice, 0);
    setTotalPrice(total);
  }, [cart]);
  return (
    <>
      <h3 className='text-center text-jasscoffee mb-3'>주문 현황</h3>
      {/* cart 정보 render */}
      <div className='product-card py-4 px-5 d-flex flex-column justify-content-between'>
        <div>
          {// 상품 정보 반복
            cart.map((product, productIdx) => (
              <div key={`product${productIdx}`} className='mb-3 d-flex flex-column'>
                <span className='fs-4'>{product.productName} - {product.totalPrice}원</span>
                {product.selectedOptions.length > 0 && ( // 상품정보가 있을 경우에만 보이기
                  <div className="product-options fs-5">
                    <span className="me-2">상품 옵션 :</span>
                    {// 옵션 정보 반복
                      product.selectedOptions.map((option, optionIdx) => (
                        <span key={`product${productIdx}-option${optionIdx}`} className="me-3">
                          {option.optionName} - {option.optionPrice}원
                        </span>
                      ))
                    }
                  </div>
                )}
              </div>
            ))
          }
        </div>
        <p className='fs-4'>총 결제 금액: {totalPrice} 원</p>
      </div>
    </>
  )
}

export default PaymentInfo