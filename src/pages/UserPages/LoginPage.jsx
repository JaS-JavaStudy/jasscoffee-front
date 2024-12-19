import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const goToLogin = (username, password) => {
    // 로그인 요청을 POST 방식으로 보내기
    axios.post('http://localhost:8080/login', { account: username, password }, { withCredentials: true })  // API 엔드포인트 URL로 수정
        .then(response => {
            // 서버 응답 처리
            console.log('로그인 성공:', response);
            console.log(response.headers.access);
            
        })
        .catch(error => {
            // 에러 처리
            console.error('로그인 실패:', error);
        });
}

function LoginPage() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // 폼 제출 처리
    const handleSubmit = (event) => {
        event.preventDefault();  // 기본 폼 제출 방지
        goToLogin(username, password);  // 로그인 함수 호출
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}> 
                <label>아이디 : </label>
                <input type='text' placeholder='아이디를 입력하세요' value={username}
                    onChange={(e) => setUsername(e.target.value)}></input>
                <br/>
                <label>패스워드 : </label>
                <input type='password' placeholder='비밀번호를 입력하세요' value={password}
                    onChange={(e) => setPassword(e.target.value)}></input>
                <button type='submit'>
                    submit
                </button>
            </form>
        </div>
    )
}

export default LoginPage