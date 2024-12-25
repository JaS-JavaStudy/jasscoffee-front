import React, { useState } from 'react';
import styles from '../payment/PaymentModal.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PaymentModal = ({ userId, cart, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [adminAccount] = useState('1234567890');

  const totalPrice = cart.reduce((acc, cur) => acc + cur.totalPrice, 0); // 총 결제 금액

  // 주문 생성
  const createOrder = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.error('Access token not found!');
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/api/orderlist',
        {
          userID: userId,
          totalPrice: totalPrice,
          isCancel: false,
        },
        {
          headers: {
            access: `${token}`,
          },
        }
      );

      // 상세 정보 데이터 구성
      const orderDetail = cart.map((v) => {
        const optionData = v.selectedOptions.reduce((acc, option) => {
          if (option.optionName === '샷 추가') acc.shot = option.quantity;
          if (option.optionName === '진주') acc.pearl = option.quantity;
          if (option.optionName === '우유') acc.milk = option.quantity;
          if (option.optionName === '시럽') acc.syrup = option.quantity;
          if (option.optionName === '바닐라 시럽') acc.vanilaSyrup = option.quantity;
          if (option.optionName === '헤이즐넛 시럽') acc.hazelnutSyrup = option.quantity;
          if (option.optionName === '휘핑 크림') acc.isWhip = option.quantity > 0;
          return acc;
        }, {});

        return {
          orderID: response.data.orderID,
          productID: v.productId,
          ...optionData,
          price: v.totalPrice,
        };
      });

      // 주문 상세 생성
      await Promise.all(orderDetail.map((orderProduct) => createOrderDetail(orderProduct)));

      alert('주문이 완료되었습니다.');
      localStorage.removeItem('cart'); // 로컬스토리지에서 cart 삭제
      onClose(); // 모달 닫기
      navigate('/mypage');
    } catch (error) {
      console.error('주문에 실패하였습니다.', error);
    }
  };

  // 주문 상세 생성
  const createOrderDetail = async (orderProduct) => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        console.error('Access token not found!');
        return;
      }
      await axios.post('http://localhost:8080/orderdetail', orderProduct, {
        headers: {
          access: `${token}`,
        },
      });
    } catch (error) {
      console.error('주문 상세 저장에 실패하였습니다.', error);
    }
  };

  // 계좌 복사 기능
  const copyAdminAccount = () => {
    navigator.clipboard
      .writeText(adminAccount)
      .then(() => {
        alert('계좌가 복사되었습니다!');
      })
      .catch((err) => {
        console.error('계좌 복사 실패:', err);
      });
  };

  // 모달이 닫힌 상태면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalDialog}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h1 className={`${styles.modalTitle} ${styles.paymentTextJass}`} id="modalLabel">
              입금 정보
            </h1>
            <button type="button" className={styles.btnClose} onClick={onClose} aria-label="Close">
              &times;
            </button>
          </div>
          <hr />
          <div className={styles.modalBody}>
            <p className={styles.modalTextSecondary}>아래 계좌로 입금 후 결제 완료 버튼을 눌러주세요.</p>
            <div className={styles.modalBodyContent}>
              <span className={styles.modalText}>받는 사람 : 관리자</span>
              <span className={styles.modalText}>
                계좌 번호 : {adminAccount} (Jass은행)
                <button className={styles.copyButton} onClick={copyAdminAccount}>
                  계좌복사
                </button>
              </span>
              <span className={styles.modalText}>결제 금액 : {totalPrice}원</span>
            </div>
          </div>
          <hr className={styles.borderLine}/>
          <div className={styles.modalFooter}>
            <button type="button" onClick={createOrder} className={styles.completeButton}>
              결제 완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
