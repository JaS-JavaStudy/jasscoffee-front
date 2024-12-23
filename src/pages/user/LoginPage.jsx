import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getUser } from '../../apis/userapis/getuser'
import axios from 'axios'
import "./LoginPage.css" // CSS 파일 임포트

function LoginPage() {

    const navigate = useNavigate()

    // 로그인 여부 확인
    //////////////////////////////////////////////////////////
    const [username, setUsername] = useState(null)

    useEffect(() => {
        getUser().then(res => {
            setUsername(res)
        })
    }, [])
    //////////////////////////////////////////////////////////


    // 로그인 기능
    //////////////////////////////////////////////////////////
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(''); // 로그인 실패 메시지

    const Login = async (username, password) => {
        await axios.post('http://localhost:8080/login',
            { account: username, password }, { withCredentials: true })
            .then(response => {
                // 로그인 후 access 토큰 추가
                localStorage.setItem('access', response.headers.access)
                navigate('/product')

            })
            .catch(error => {
                // 에러 처리
                setLoginError('아이디 또는 비밀번호가 잘못되었습니다.');
            });
    }
    // 핸들러
    const loginHandler = (event) => {
        event.preventDefault();  // 기본 폼 제출 방지

        // 초기 오류 메시지 제거
        setLoginError('');

        let valid = true;

        // 아이디 유효성 검사
        if (!id) {
            setLoginError('아이디를 입력해주세요.');
            valid = false;
        }

        // 비밀번호 유효성 검사
        if (!password) {
            setLoginError('비밀번호를 입력해주세요.');

            if (!id) {
                setLoginError('아이디와 비밀번호를 입력해주세요.')
            }
            valid = false;
        }

        if (valid) {
            // 로그인 함수 호출
            Login(id, password)
        }
    }
    /////////////////////////////////////////////////////////

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
                            <input
                                type='text'
                                placeholder='ID'
                                value={id}
                                onChange={(e) => setId(e.target.value)}>

                            </input>
                            <input
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}>
                            </input>

                            {loginError && <p className="error-message">{loginError}</p>}

                            <button type='submit'>
                                Log in
                            </button>
                        </form>
                        <Link to={"signup"}>Sign up</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginPage;