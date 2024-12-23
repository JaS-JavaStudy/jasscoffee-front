// pages/AdminMain.jsx
import './AdminMain.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminMain() {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); // 전체 주문 목록을 저장할 상태
  const [showAll, setShowAll] = useState(false); // 전체 목록을 볼지, 오늘의 주문만 볼지 상태
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const access = localStorage.getItem('access'); // access 토큰 가져오기
    try {
      const response = await axios.get('http://localhost:8080/api/orderlist', {
        headers: {
          access: access, // 인증 헤더 설정
        },
      });
      
      setAllOrders(response.data); // 전체 주문 목록 저장
      filterTodayOrders(response.data); // 오늘 주문만 필터링
    } catch (error) {
      console.error('주문 목록 조회 실패:', error);
    }
  };

  const filterTodayOrders = (orders) => {
    // 오늘 날짜 기준으로 필터링
    const today = new Date();
    const filteredOrders = orders.filter(order => {
      const orderedAt = new Date(order.orderedAt);
      return (
        orderedAt.getDate() === today.getDate() &&
        orderedAt.getMonth() === today.getMonth() &&
        orderedAt.getFullYear() === today.getFullYear()
      );
    });
    
    setOrders(filteredOrders); // 오늘의 주문만 상태에 저장
  };

  const handleDelete = async (orderId) => {
    const access = localStorage.getItem('access'); // access 토큰 가져오기
    if (window.confirm('주문을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:8080/api/orderlist/${orderId}`, {
          headers: {
            access: access, // 인증 헤더 설정
          },
        });
        fetchOrders(); // 목록 새로고침
      } catch (error) {
        console.error('주문 삭제 실패:', error);
      }
    }
  };

  const toggleOrderView = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setOrders(allOrders); // 전체 주문 목록으로 설정
    } else {
      filterTodayOrders(allOrders); // 오늘의 주문만 필터링
    }
  };

  return (
    <div className='page-wrapper'>
      <div className='container'>
        <div>
          <h2>주문 관리</h2>
          <div className="d-flex mb-4">
            <div className='button-group'>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/admin/menu')}
              >
                메뉴 관리
              </button>
              <button
                className="btn btn-secondary"
                onClick={toggleOrderView}
              >
                {showAll ? '오늘의 주문만 보기' : '전체 주문 보기'}
              </button>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>주문 ID</th>
                <th>사용자</th>
                <th>mmid</th>
                <th>총 금액</th>
                {/* <th>주문 상태</th> */}
                <th>주문 시간</th>
                <th>취소</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.orderID}>
                  <td>{order.orderID}</td>
                  <td>{order.name}</td>
                  <td>{order.mmid}</td>
                  <td>{order.totalPrice.toLocaleString()}원</td>
                  {/* <td>{order.isCancel ? '취소됨' : '정상'}</td> */}
                  <td>{new Date(order.orderedAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(order.orderID)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
