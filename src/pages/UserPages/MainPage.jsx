import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUser } from '../../apis/userapis/getuser'
import { logout } from '../../apis/userapis/logout'
import { Login } from '../../apis/userapis/login'
import Layout from '../Layout'
import "./MainPage.css" // CSS 파일 임포트

function MainPage() {
    const [username, setUsername] = useState(null)

    // 로그인 form
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    // Router 기능
    const navigate = useNavigate()

    // onMounted 기능
    // account 불러와서 이름 넣기 (테스트용임 후에 수정 예정)
    useEffect(() => {
        getUser().then(res => {
            setUsername(res)
        })
    }, [])

    // 로그아웃 
    const logoutHandler = (event) => {
        event.preventDefault();
        logout(navigate);
        setUsername(null)
    }

    // 로그인 
    const loginHandler = (event) => {
        event.preventDefault();  // 기본 폼 제출 방지
        Login(id, password, navigate);  // 로그인 함수 호출
    }

    return (
        <Layout>
            <div className="page-container">
                <h1>JASS-COFFEE</h1>
                <h3>당신의 COFFEE에 로그인하세요 !</h3>
                {username ? (
                    <div className="card">
                        <h3>안녕하세요 {username}님 !</h3>
                    </div>
                ) : (
                    <div className="card">
                        
                        <form onSubmit={loginHandler}>
                            <input type='text' placeholder='ID' value={id}
                                onChange={(e) => setId(e.target.value)} required></input>
                            <br />
                            <input type='password' placeholder='Password' value={password}
                                onChange={(e) => setPassword(e.target.value)} required></input>
                            <button type='submit'>
                                Log in
                            </button>
                        </form>
                        <Link to={"signup"}>Sign up now</Link>
                    </div>
                )}
            </div>
        </Layout>
    )
}

export default MainPage
