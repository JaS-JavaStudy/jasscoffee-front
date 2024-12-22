import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../apis/userapis/signup';
import './Signuppage.css';

function SignupPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [mmid, setMmid] = useState('');
    const [fund, setFund] = useState('');
    const [bank, setBank] = useState('');  // 은행 상태 추가
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // 회원가입 함수 호출
        signUp(username, password, name, mmid, fund, bank, navigate);
    };

    return (
        <div className="page-container">
            <div className="card">
                <h1>회원가입</h1>
                <form onSubmit={handleSubmit}>
                    <label>아이디 :</label>
                    <input
                        type="text"
                        placeholder="아이디를 입력하세요"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <br />
                    <label>패스워드 :</label>
                    <input
                        type="password"
                        placeholder="비밀번호를 입력하세요"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <br />
                    <label>이름 :</label>
                    <input
                        type="text"
                        placeholder="이름을 입력하세요"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <br />
                    <label>MMID :</label>
                    <input
                        type="text"
                        placeholder="MMID를 입력하세요"
                        value={mmid}
                        onChange={(e) => setMmid(e.target.value)}
                        required
                    />
                    <br />
                    <label>은행 선택 :</label>
                    <select
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
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

                        {/* 필요에 따라 은행 목록 추가 가능 */}
                    </select>
                    <br />
                    <label>계좌 번호 :</label>
                    <input
                        type="text"
                        placeholder="계좌 번호를 입력하세요"
                        value={fund}
                        onChange={(e) => setFund(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">회원가입</button>
                </form>
            </div>
        </div>
    );
}

export default SignupPage;
