import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import jwt_decode from "jwt-decode";

const MyPage = () => {
  const [userData, setUserData] = useState({ account: "", name: "", mmid: "", fund: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [editData, setEditData] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 유저 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
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

    fetchUserData();
  }, []);

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
      const token = localStorage.getItem("accessToken");
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
      const token = localStorage.getItem("accessToken");
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
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("인증 정보가 없습니다. 다시 로그인 해주세요.");
        return;
      }

      // DELETE 요청 시, axios에서는 data를 전달하려면 아래와 같이 해야 합니다.
      // (또는 URL 파라미터 등으로 전달)
      await axios.delete("http://localhost:8080/users/delete", {
        headers: {
          access: `${token}`,
        },
        data: { account: userData.account },
      });

      alert("회원 탈퇴가 완료되었습니다.");
      // 이후 필요하다면 토큰 삭제, 메인 페이지로 이동 등의 로직 추가
      localStorage.removeItem("accessToken");
      // window.location.href = "/";
    } catch (error) {
      console.error("회원 탈퇴 중 오류가 발생했습니다.", error);
      alert("회원 탈퇴에 실패했습니다.");
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">My Page</h1>

      {/* 비밀번호 변경 모드가 아닐 때 */}
      {!isChangingPassword ? (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">개인정보</h2>
              {isEditing ? (
                <div>
                  <div className="mb-3">
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
                    <label className="form-label">환불계좌</label>
                    <input
                      type="text"
                      name="fund"
                      value={editData.fund}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  </div>
                  <button onClick={handleSave} className="btn btn-primary me-2">저장</button>
                  <button onClick={handleCancel} className="btn btn-secondary">취소</button>
                </div>
              ) : (
                <div>
                  <p><strong>아이디:</strong> {userData.account}</p>
                  <p><strong>이름:</strong> {userData.name}</p>
                  <p><strong>mmId:</strong> {userData.mmid}</p>
                  <p><strong>환불계좌:</strong> {userData.fund}</p>
                  <button onClick={handleEditClick} className="btn btn-primary">개인정보 수정</button>
                </div>
              )}
            </div>
          </div>

          <div>
            <button onClick={handleDeleteAccount} className="btn btn-danger me-2">
              회원 탈퇴
            </button>
            <button onClick={handlePasswordChangeClick} className="btn btn-warning">
              비밀번호 변경
            </button>
          </div>
        </>
      ) : (
        // 비밀번호 변경 모드일 때
        <div className="card">
          <div className="card-body">
            <h2 className="card-title">비밀번호 변경</h2>
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
            <button onClick={handlePasswordSave} className="btn btn-primary me-2">저장</button>
            <button onClick={handlePasswordCancel} className="btn btn-secondary">취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;