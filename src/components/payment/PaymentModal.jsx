import React, { useRef } from 'react'
import './PaymentModal.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PaymentModal = ({userId, cart}) => {
  const navigate = useNavigate()

  const closeButtonRef = useRef(null)

  const totalPrice = cart.reduce((acc, cur) => { return acc += cur.totalPrice}, 0) // 총 결제 금액
  // 주문 생성
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
      // 상세 정보 데이터 구성
      const orderDetail = cart.map((v) => {
        const optionData = v.selectedOptions.reduce((acc, option) => {
          // 각 옵션을 acc 객체에 추가
          if (option.optionName === "샷 추가") {
            acc.shot = option.quantity;  // 샷 추가
          }
          if (option.optionName === "진주") {
            acc.pearl = option.quantity;  // 진주
          }
          if (option.optionName === "우유") {
            acc.milk = option.quantity;  // 우유
          }
          if (option.optionName === "시럽") {
            acc.syrup = option.quantity;  // 시럽
          }
          if (option.optionName === "바닐라 시럽") {
            acc.vanilaSyrup = option.quantity;  // 바닐라 시럽
          }
          if (option.optionName === "헤이즐넛 시럽") {
            acc.hazelnutSyrup = option.quantity;  // 헤이즐넛 시럽
          }
          if (option.optionName === "휘핑 크림") {
            acc.isWhip = option.quantity > 0;  // 휘핑 크림 (0이면 없음, 1이면 있음)
          }
          return acc;
        }, {}) // optionData는 옵션을 저장할 객체
      
        const data = {
          orderID: response.data.orderID,  // 주문 ID
          productID: v.productId,  // 제품 ID
          ...optionData,  // 옵션 데이터를 추가
          price: v.totalPrice  // 가격
        }
        
        return data
      })
      orderDetail.forEach((orderProduct) => {
        createOrderDetail(orderProduct)
      })
      alert('주문이 완료되었습니다.')

      // 로컬스토리지에서 cart 삭제
      localStorage.removeItem("cart");

      // useRef로 참조한 버튼 클릭
      if (closeButtonRef.current) {
        closeButtonRef.current.click() 
      }

      navigate('/mypage')
    } catch (error) {
      console.error('주문에 실패하였습니다.', error)
    }
  }
  // 주문 상세 생성
  const createOrderDetail = async (orderProduct) => {
    try {
      const token = localStorage.getItem("access");
        if (!token) {
          console.error("Access token not found!");
          return;
        }
      const response = await axios.post(
        'http://localhost:8080/orderdetail',
        orderProduct,
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
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ref={closeButtonRef}></button>
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