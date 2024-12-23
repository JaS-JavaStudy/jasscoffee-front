// pages/AdminMain.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminMain() {
  const [orders, setOrders] = useState([]);
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
      setOrders(response.data);
    } catch (error) {
      console.error('주문 목록 조회 실패:', error);
    }
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

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <h2>주문 관리</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/admin/menu')}
        >
          메뉴 관리
        </button>
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
  );
}
