import { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

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

  useEffect(() => {
    const fetchUserData = async () => {
      const data = {
        account: "test", 
        name: "박주찬",
        mmid: "test1",
        fund: "ibk 972-027713-01017",
      };
      setUserData(data);
    };

    fetchUserData();
  }, []);

  const handleEditClick = () => {
    setEditData(userData);
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleSave = async () => {
    alert("개인정보가 저장되었습니다."); // 예시
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handlePasswordChangeClick = () => {
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setIsChangingPassword(true);
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handlePasswordSave = async () => {
    alert("비밀번호가 변경되었습니다."); // 예시
    setIsChangingPassword(false);
  };

  const handlePasswordCancel = () => {
    setIsChangingPassword(false);
  };

  const handleDeleteAccount = () => {
    alert("회원 탈퇴가 완료되었습니다.");
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">My Page</h1>
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
            <button onClick={handleDeleteAccount} className="btn btn-danger">
              회원 탈퇴
            </button>
            <button onClick={handlePasswordChangeClick} className="btn btn-warning">
              비밀번호 변경
            </button>
          </div>
        </>
      ) : (
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
