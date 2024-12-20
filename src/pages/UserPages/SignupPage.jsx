import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';

const goToSignUp = (username, password, name, mmid, fund, navigate) => {
    // 회원가입 요청을 POST 방식으로 보내기
    axios.post('http://localhost:8080/join', {
        account: username,
        password,
        name,
        mmid,
        fund,
        isStaff: false

    }, { withCredentials: true })
        .then(response => {
            // 서버 응답 처리
            console.log('회원가입 성공:', response);
            navigate('/')

        })
        .catch(error => {
            // 에러 처리
            console.error('회원가입 실패:', error);
        });
}

function SignupPage() {
    // 회원가입 변수
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [mmid, setMmid] = useState('');
    const [fund, setFund] = useState('');

    const navigate = useNavigate()

    // 폼 제출 처리
    const handleSubmit = (event) => {
        event.preventDefault();  // 기본 폼 제출 방지
        // 회원가입 함수 호출
        goToSignUp(username, password, name, mmid, fund, navigate);
    };

    return (
        <Layout>
            <h1>회원가입</h1>
            <form onSubmit={handleSubmit}>
                <label>아이디 : </label>
                <input
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <br />
                <label>패스워드 : </label>
                <input
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <label>이름 : </label>
                <input
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <br />
                <label>MMID : </label>
                <input
                    type="text"
                    placeholder="MMID를 입력하세요"
                    value={mmid}
                    onChange={(e) => setMmid(e.target.value)}
                    required
                />
                <br />
                <label>계좌 : </label>
                <input
                    type="text"
                    placeholder="계좌를 입력하세요"
                    value={fund}
                    onChange={(e) => setFund(e.target.value)}
                    required
                />
                <br />
                <button type="submit">
                    회원가입
                </button>
            </form>
        </Layout>
    );
}

export default SignupPage