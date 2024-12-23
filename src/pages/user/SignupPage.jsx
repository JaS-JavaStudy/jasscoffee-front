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
    const [error, setError] = useState(''); // 에러 상태 추가
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        // 회원가입 유효성 검사
        if (!validateForm()) {
            return
        }

        // 회원가입 함수 호출
        signUp(username, password, name, mmid, fund, bank, navigate);
    };
    // 회원가입 유효성 검사
    const validateForm = () => {
        // 아이디 유효성 검사
        if (username.trim() === '') {
            setError('아이디를 입력해주세요.');
            return false;
        }

        // 비밀번호 유효성 검사 (8자 이상)
        if (password.length < 8) {
            setError('비밀번호는 8자 이상이어야 합니다.');
            return false;
        }

        // 이름 유효성 검사
        if (name.trim() === '') {
            setError('이름을 입력해주세요.');
            return false;
        }

        // MMID 유효성 검사
        if (mmid.trim() === '') {
            setError('MMID를 입력해주세요.');
            return false;
        }

        // 계좌 번호 유효성 검사
        if (fund.trim() === '') {
            setError('계좌 번호를 입력해주세요.');
            return false;
        }

        // 은행 선택 유효성 검사
        if (bank === '') {
            setError('은행을 선택해주세요.');
            return false;
        }

        // 모든 검사를 통과하면 에러 메시지 초기화
        setError('');
        return true;
    };
    return (
        <div className="page-container">
            <div className="card">
                <h1>Sign Up</h1>
                {error && <div className="error-message">{error}</div>} {/* 에러 메시지 출력 */}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="ID"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="MMID"
                        value={mmid}
                        onChange={(e) => setMmid(e.target.value)}
                        required
                    />
                    <br/>
                    <select
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        required
                    >
                        <option value="">Bank</option>
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
                    <input
                        type="text"
                        placeholder="Account"
                        value={fund}
                        onChange={(e) => setFund(e.target.value)}
                        required
                    />
                    <br />
                    <button type="submit">Sign up</button>
                </form>
            </div>
        </div>
    );
}

export default SignupPage;
