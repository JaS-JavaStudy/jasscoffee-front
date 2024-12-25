import React, { useEffect, useState } from 'react';
import PaymentInfo from '../../components/payment/PaymentInfo';
import PaymentModal from '../../components/payment/PaymentModal';
import styles from './PaymentPage.module.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUser } from '../../apis/userapis/getuser';

const PaymentPage = () => {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const [userId, setUserId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 관리

  // 필요한 정보 만들기
  useEffect(() => {
    const checkUser = async () => {
      const isUser = await getUser();

      if (isUser == null) {
        alert('Login을 하셔야해요.');
        navigate('/');
      }
    };

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access');
        if (!token) {
          console.error('Access token not found!');
          return;
        }
        // userId 불러오기
        const response = await axios.get(`http://localhost:8080/api/orderlist/getUserId`, {
          headers: {
            access: `${token}`,
          },
        });

        setUserId(response.data);
      } catch (error) {
        console.error('There was an error fetching the user data!', error);
      }
    };
    checkUser();
    fetchData();
  }, [navigate]);

  // 모달 열기 핸들러
  const handleOpenModal = () => {
    setIsModalOpen(true); // 모달 열기
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div className='page-container'>
      <div className='container'>
        <PaymentInfo cart={cart} />
        <div className={styles.btnContainer}>
          <button className={`${styles.payButton}`} onClick={handleOpenModal}>
            입금하기
          </button>
        </div>
        <PaymentModal 
          userId={userId}
          cart={cart}
          isOpen={isModalOpen} // 모달 열림 상태 전달
          onClose={handleCloseModal} // 모달 닫기 핸들러 전달
        />
      </div>
    </div>
  );
};

export default PaymentPage;
