import styles from './AdminMain.module.css';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; 

export default function AdminMain() {
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const navigate = useNavigate();
  const tableContainerRef = useRef(null); // 테이블 컨테이너 참조 생성

  useEffect(() => {
    fetchOrders();
    adjustTableScroll(); // 초기 테이블 크기 조정
    window.addEventListener('resize', adjustTableScroll); // 창 크기 변경 시 조정

    return () => {
      window.removeEventListener('resize', adjustTableScroll);
    };
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
    adjustTableScroll(); // 테이블 스크롤 다시 조정
  };

  const handleSearch = () => {
    if (!searchWord.trim()) {
      alert('검색어를 입력하세요.');
      return;
    }

    const filteredOrders = allOrders.filter(order =>
      order.name.includes(searchWord) || order.mmid.includes(searchWord)
    );
    setOrders(filteredOrders);
    adjustTableScroll(); // 테이블 스크롤 다시 조정
  };

  // 테이블 높이 확인 및 스크롤 조정 함수
  const adjustTableScroll = () => {
    const tableContainer = tableContainerRef.current;
    if (tableContainer) {
      if (tableContainer.scrollHeight > window.innerHeight * 0.8) {
        tableContainer.style.maxHeight = '80vh';
        tableContainer.style.overflowY = 'auto';
      } else {
        tableContainer.style.maxHeight = 'none';
        tableContainer.style.overflowY = 'hidden';
      }
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <h2 className={styles.h2}>주문 관리</h2>
          <div className={`${styles.flex} ${styles.mb4}`}>
            <div className={styles.searchGroup}>
              <input
                type="text"
                className={`${styles.formControl} ${styles.searchInput}`}
                placeholder="  검색어를 입력하세요"
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
              />
              <button 
                className={styles.btnSecondary}
                onClick={handleSearch}
              >
                검색
              </button>
            </div>
            <div className={styles.buttonGroup}>
              <button 
                className={styles.btnSecondary}
                onClick={() => navigate('/admin/menu')}
              >
                메뉴 관리
              </button>
              <button
                className={styles.btnSecondary}
                onClick={toggleOrderView}
              >
                {showAll ? '오늘의 주문만 보기' : '전체 주문 보기'}
              </button>
            </div>
          </div>
          <div className={styles.tableContainer}>
          <table className={styles.table}>
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
                      className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
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
    </div>
  );
}
