import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import jwt_decode from "jwt-decode";
import { getUser } from "../../apis/userapis/getuser";
import { useNavigate } from 'react-router-dom';
import styles from "./MyPage.module.css";
import '../../App.css'


const MyPage = () => {
  const [userData, setUserData] = useState({ account: "", name: "", mmid: "", fund: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editData, setEditData] = useState(null);
  const [orders, setOrders] = useState([])
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const shouldScroll = orders.length >= 0; // 주문 내역이 5개 이상이면 스크롤 필요
    document.body.style.overflow = shouldScroll ? "auto" : "hidden";
  
    return () => {
      // MyPage에서 벗어날 때 스타일 복구
      document.body.style.overflow = "";
    };
  }, [orders]);
  

  // 유저 정보 가져오기
  useEffect(() => {
    
    const checkUser = async () => {
      const isUser = await getUser()

      if (isUser == null) {
        alert("Login을 하셔야해요.")
        navigate('/')
      }
    }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          console.error("Access token not found!");
          return;
        }

        const decoded = jwt_decode(token);
        const account = decoded.account; // JWT에서 account 추출

        const response = await axios.get(`http://localhost:8080/users/${account}`, {
          headers: {
            access: `${token}`,
          },
        });

        setUserData(response.data);
      } catch (error) {
        console.error("There was an error fetching the user data!", error);
      }
    };
    checkUser()
    fetchUserData();
  }, [navigate]);

   // 주문 내역 가져오기
   useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          console.error("Access token not found!");
          return;
        }

        const response = await axios.get("http://localhost:8080/api/orderlist/my", {
          headers: {
            access: `${token}`,
          },
        });

        setOrders(response.data); // 주문 데이터를 상태로 저장
      } catch (error) {
        console.error("There was an error fetching the order list!", error);
      }
    };

    fetchOrders();
  }, []);

  useEffect(()=> {
    getUser()
  })

  // 개인정보 수정 모드로 전환
  const handleEditClick = () => {
    setEditData(userData);
    setIsEditing(true);
  };

  // 수정 폼 입력값 실시간 업데이트
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  // 개인정보 수정 저장
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("인증 정보가 없습니다. 다시 로그인 해주세요.");
        return;
      }

      // PUT 또는 POST/패치 등의 메서드는 서버 구현에 따라 다를 수 있습니다.
      // 여기서는 PUT 예시
      await axios.put("http://localhost:8080/update", editData, {
        headers: {
          access: `${token}`,
        },
      });

      alert("개인정보가 저장되었습니다.");
      setUserData(editData); // 수정한 데이터로 state 갱신
      setIsEditing(false);
    } catch (error) {
      console.error("개인정보 수정 중 오류가 발생했습니다.", error);
      alert("개인정보 수정에 실패했습니다.");
    }
  };

  // 수정 취소
  const handleCancel = () => {
    setIsEditing(false);
  };

  // 비밀번호 변경 모드로 전환
  const handlePasswordChangeClick = () => {
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsChangingPassword(true);
  };

  // 비밀번호 변경 폼 입력값 실시간 업데이트
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // 비밀번호 변경 저장
  const handlePasswordSave = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("인증 정보가 없습니다. 다시 로그인 해주세요.");
        return;
      }

      // 서버가 요구하는 파라미터(form-data/json 등)는 서버 로직에 맞춰서 수정하세요.
      await axios.put("http://localhost:8080/password/update", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      }, {
        headers: {
          access: `${token}`,
        },
      });

      alert("비밀번호가 변경되었습니다.");
      setIsChangingPassword(false);
    } catch (error) {
      console.error("비밀번호 변경 중 오류가 발생했습니다.", error);
      alert("비밀번호 변경에 실패했습니다.");
    }
  };

  // 비밀번호 변경 취소
  const handlePasswordCancel = () => {
    setIsChangingPassword(false);
  };

  

  // 회원 탈퇴
  const handleDeleteAccount = async () => {
    try {
      // 경고 메시지 표시
      const isConfirmed = window.confirm("정말로 탈퇴하시겠습니까?");
      if (!isConfirmed) {
        // 사용자가 취소를 누른 경우
        alert("회원 탈퇴가 취소되었습니다.");
        return;
      }
  
      const token = localStorage.getItem("access");
      if (!token) {
        alert("인증 정보가 없습니다. 다시 로그인 해주세요.");
        return;
      }
  
      // DELETE 요청
      await axios.delete("http://localhost:8080/users/delete", {
        headers: {
          access: `${token}`,
        },
        data: { account: userData.account },
      });
  
      alert("회원 탈퇴가 완료되었습니다.");
      // 토큰 삭제 및 메인 페이지로 이동
      localStorage.removeItem("access");
      navigate("/");
    } catch (error) {
      console.error("회원 탈퇴 중 오류가 발생했습니다.", error);
      alert("회원 탈퇴에 실패했습니다.");
    }

    
  };
  return (
  
    <div className={styles.mypageContainer}>
      <h1 className={`text-center mb-4 ${styles.mypageHeader}`}>My Page</h1>

      {!isChangingPassword ? (
        <>
          {/* -------------------
              개인정보 카드 섹션
             ------------------- */}
          <div className={`${styles.mypageCard} card mb-4`}>
            <div className={`${styles.mypageCardBody} card-body`}>
              <h2 className={`${styles.mypageCardTitle} card-title`}>개인정보</h2>
              {isEditing ? (
                <div>
                  <div className={styles.informationContainer}>
                    <label className="form-label">아이디</label>
                    <input
                      type="text"
                      name="account"
                      value={editData.account}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">이름</label>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">mmId</label>
                    <input
                      type="text"
                      name="mmid"
                      value={editData.mmid}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">환불은행</label>
                    <select
                      name="bank"
                      className="form-control"
                      value={editData.bank}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">은행을 선택하세요</option>
                      <option value="카카오뱅크">카카오뱅크</option>
                      <option value="신한은행">신한은행</option>
                      <option value="KB국민은행">KB국민은행</option>
                      <option value="우리은행">우리은행</option>
                      <option value="하나은행">하나은행</option>
                      <option value="농협은행">농협은행</option>
                      <option value="기업은행">기업은행</option>
                      <option value="SC제일은행">SC제일은행</option>
                      <option value="우체국은행">우체국은행</option>
                      <option value="토스뱅크">토스뱅크</option>
                      <option value="케이뱅크">케이뱅크</option>
                      <option value="씨티은행">씨티은행</option>
                      <option value="스탠다드차타드">스탠다드차타드</option>
                      <option value="한국산업은행">한국산업은행</option>
                      <option value="수출입은행">수출입은행</option>
                      <option value="미래에셋">미래에셋</option>
                      <option value="대구은행">대구은행</option>
                      <option value="부산은행">부산은행</option>
                      <option value="제주은행">제주은행</option>
                      <option value="광주은행">광주은행</option>
                      <option value="우체국은행">우체국은행</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">환불계좌</label>
                    <input
                      type="text"
                      name="fund"
                      value={editData.fund}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <button onClick={handleSave} className={styles.mypageButton}>
                    저장
                  </button>
                  <button onClick={handleCancel} className={styles.mypageButton}>
                    취소
                  </button>
                </div>
              ) : (
                <div className={styles.informationContainer}>
                  <p><strong>아이디:</strong> {userData.account}</p>
                  <p><strong>이름:</strong> {userData.name}</p>
                  <p><strong>mmId:</strong> {userData.mmid}</p>
                  <p><strong>환불은행:</strong> {userData.bank}</p>
                  <p><strong>환불계좌:</strong> {userData.fund}</p>
                  <button onClick={handleEditClick} className={styles.mypageButton}>
                    개인정보 수정
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* -------------------
              주문 내역 카드 섹션
             ------------------- */}
          <div className={`${styles.mypageCard} card mt-4`}>
  <div className={`${styles.mypageCardBody} card-body`}>
    <h2 className={`${styles.mypageCardTitle} card-title`}>주문 내역</h2>
    {orders.length === 0 ? (
      <p>주문 내역이 없습니다.</p>
    ) : (
      <div className={styles.orderListContainer}>
        <table className={`${styles.mypageTable} table`}>
          <thead>
            <tr>
              <th>#</th>
              <th>총 가격</th>
              <th>주문 상태</th>
              <th>주문 날짜</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.orderID}>
                <td>{index + 1}</td>
                <td>{order.totalPrice} 원</td>
                <td>{order.isCancel ? "취소됨" : "완료"}</td>
                <td>{new Date(order.orderedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
</div>

          {/* -------------------
              하단 버튼 섹션
             ------------------- */}
          <div>
            <button onClick={handleDeleteAccount} className={styles.mypageButton}>
              회원 탈퇴
            </button>
            <button onClick={handlePasswordChangeClick} className={styles.mypageButton}>
              비밀번호 변경
            </button>
          </div>
        </>
      ) : (
        /* -------------------
           비밀번호 변경 카드
           ------------------- */
        <div className={`${styles.mypageCard} card`}>
          <div className={`${styles.mypageCardBody} card-body`}>
            <h2 className={`${styles.mypageCardTitle} card-title`}>비밀번호 변경</h2>
            <div className="mb-3">
              <label className="form-label">현재 비밀번호</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">새로운 비밀번호</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">새로운 비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordInputChange}
                className="form-control"
              />
            </div>
            <button onClick={handlePasswordSave} className={styles.mypageButton}>
              저장
            </button>
            <button onClick={handlePasswordCancel} className={styles.mypageButton}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  
  );

};

export default MyPage;
