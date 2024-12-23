import React from 'react'
import './PaymentModal.css'
import axios from 'axios'

const PaymentModal = ({userId, cart}) => {
  console.log(userId)
  console.log(cart)
  const totalPrice = cart.reduce((acc, cur) => { return acc += cur.totalPrice}, 0)
  const createOrder = async () => {
    try {
      const token = localStorage.getItem("access");
        if (!token) {
          console.error("Access token not found!");
          return;
        }
      const response = await axios.post(
        'http://localhost:8080/api/orderlist',
        {// 요청 데이터
          userID: userId,
          totalPrice: totalPrice,
          isCancel: false
        },
        {
          headers: {
            access: `${token}`,
          }
        },
        
      )
      console.log(response.data)
      const orderDetail = cart.map((v) => {
        const data = {
          orderID: response.data.orderID,
          productID: v.productId,

        }
        return data
      })
    } catch (error) {
      console.error('주문에 실패하였습니다.', error)
    }
  }

  const createOrderDetail = async () => {
    try {
      const token = localStorage.getItem("access");
        if (!token) {
          console.error("Access token not found!");
          return;
        }
      const response = await axios.post(
        'http://localhost:8080/api/orderlist',
        {// 요청 데이터
          userID: userId,
          totalPrice: totalPrice,
          isCancel: false
        },
        {
          headers: {
            access: `${token}`,
          }
        },
        
      )
    } catch (error) {
      console.error('주문 상세 저장에 실패하였습니다.', error)
    }
  }
  return (
    <div className="modal fade" id="payment-modal" tabIndex="-1" aria-labelledby="modalLabel" aria-hidden="true">
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-3 text-jasscoffee" id="modalLabel">입금 정보</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p className='fs-5 text-secondary'>아래 계좌로 입금 후 결제 완료 버튼을 눌러주세요.</p>
            <div className='d-flex flex-column'>
              <span className='fs-4'>받는 사람 : 관리자</span>
              <span className='fs-4'>계좌 번호 : 1234-567890-12 (Jass은행)</span>
              <span className='fs-4'>결제 금액 : {totalPrice}원</span>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={createOrder} className="btn-jasscoffee">결제 완료</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal