import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUser } from '../../apis/userapis/getuser'
import { refresh } from '../../apis/userapis/refresh'
import { logout } from '../../apis/userapis/logout'
import { Login } from '../../apis/userapis/login'
import Layout from '../Layout'


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
            <div>
                <h1>메인 페이지</h1>
                {username ? (
                    <div>
                        <h3>안녕하세요 {username}님 !</h3>
                        <button onClick={logoutHandler}>로그아웃</button>
                    </div>

                ) : (
                    <div>
                        <h3>로그인 해주세요</h3>
                        <form onSubmit={loginHandler}>
                            <label>아이디 : </label>
                            <input type='text' placeholder='아이디를 입력하세요' value={id}
                                onChange={(e) => setId(e.target.value)} required></input>
                            <br />
                            <label>패스워드 : </label>
                            <input type='password' placeholder='비밀번호를 입력하세요' value={password}
                                onChange={(e) => setPassword(e.target.value)} required></input>
                            <button type='submit'>
                                submit
                            </button>
                        </form>
                        <Link to={"signup"}>회원가입</Link>
                    </div>

                )
                }
            </div>
        </Layout>
    )
}

export default MainPage