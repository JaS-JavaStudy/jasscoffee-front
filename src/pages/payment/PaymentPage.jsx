import React from 'react'
import PaymentInfo from '../../components/payment/PaymentInfo'
import PaymentModal from '../../components/payment/PaymentModal'
import './PaymentPage.css'

const PaymentPage = () => {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]'); 
  return (
    <div className='container'>
      <PaymentInfo
        cart={cart}
      />
      <div className='btn-area d-grid'>
        <button className='btn-jasscoffee' data-bs-toggle="modal" data-bs-target="#payment-modal">
          입금하기
        </button>
      </div>
      <PaymentModal />
    </div>
  )
}

export default PaymentPage