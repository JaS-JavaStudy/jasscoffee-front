import './AdminMain.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AdminMain() {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [searchWord, setSearchWord] = useState(''); // 검색어 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const access = localStorage.getItem('access');
    try {
      const response = await axios.get('http://localhost:8080/api/orderlist', {
        headers: {
          access: access,
        },
      });
      setAllOrders(response.data);
      filterTodayOrders(response.data);
    } catch (error) {
      console.error('주문 목록 조회 실패:', error);
    }
  };

  const filterTodayOrders = (orders) => {
    const today = new Date();
    const filteredOrders = orders.filter(order => {
      const orderedAt = new Date(order.orderedAt);
      return (
        orderedAt.getDate() === today.getDate() &&
        orderedAt.getMonth() === today.getMonth() &&
        orderedAt.getFullYear() === today.getFullYear()
      );
    });
    setOrders(filteredOrders);
  };

  const handleDelete = async (orderId) => {
    const access = localStorage.getItem('access');
    if (window.confirm('주문을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:8080/api/orderlist/${orderId}`, {
          headers: {
            access: access,
          },
        });
        fetchOrders();
      } catch (error) {
        console.error('주문 삭제 실패:', error);
      }
    }
  };

  const toggleOrderView = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setOrders(allOrders);
    } else {
      filterTodayOrders(allOrders);
    }
  };

  const handleSearch = () => {
    if (!searchWord.trim()) {
      alert('검색어를 입력하세요.');
      return;
    }

    const filteredOrders = allOrders.filter(order =>
      order.name.includes(searchWord) || // 사용자 이름 검색
      order.mmid.includes(searchWord) // mmid 검색
    );
    setOrders(filteredOrders); // 검색 결과를 상태에 반영
  };

  return (
    <div className='page-wrapper'>
      <div className='container'>
        <div>
          <h2>주문 관리</h2>
          <div className="d-flex mb-4">
            {/* 검색 창과 버튼 추가 */}
            <div className='search-group'>
              <input
                type="text"
                className="form-control search-input"
                placeholder="검색어를 입력하세요"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
              />
              <button 
                className="btn btn-secondary"
                onClick={handleSearch}
              >
                검색
              </button>
            </div>
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
