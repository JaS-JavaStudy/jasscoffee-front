import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUser } from '../../apis/userapis/getuser'

import { Login } from '../../apis/userapis/login'
import "./MainPage.css" // CSS 파일 임포트

function MainPage() {
    const [username, setUsername] = useState(null)

    // 로그인 form
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate()

    useEffect(() => {
        getUser().then(res => {
            setUsername(res)
        })
    }, [])

    // 로그인 
    const loginHandler = (event) => {
        event.preventDefault();  // 기본 폼 제출 방지
        Login(id, password, navigate);  // 로그인 함수 호출
    }

    return (
        <div>
            <div className="page-container">
                <h1>JASS-COFFEE</h1>
                <h3>당신의 COFFEE에 로그인하세요 !</h3>
                {username ? (
                    alert("이미 로그인되어 있어요"),
                    navigate('/product')
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
          
        </div>
      );
    }
    
    export default MainPage;