import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '../../apis/userapis/getuser';
import axios from 'axios';
import style from './LoginPage.module.css'; // 스타일 모듈 임포트

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState(null);
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');

    useEffect(() => {
        getUser().then((res) => setUsername(res));
    }, []);

    const Login = async (username, password) => {
        try {
            const response = await axios.post(
                'http://localhost:8080/login',
                { account: username, password },
                { withCredentials: true }
            );
            localStorage.setItem('access', response.headers.access);
            navigate('/product');
        } catch {
            setLoginError('아이디 또는 비밀번호가 잘못되었습니다.');
        }
    };

    const loginHandler = (event) => {
        event.preventDefault();
        setLoginError('');

        if (!id || !password) {
            setLoginError(id ? '비밀번호를 입력해주세요.' : '아이디를 입력해주세요.');
            return;
        }

        Login(id, password);
        localStorage.removeItem('cart');
    };

    if (username) {
        alert('이미 로그인되어 있어요');
        navigate('/product');
        return null;
    }

    return (
        <div className={style.pageContainer}>
        <h1 className={style.h1}>JASS-COFFEE</h1>
        <h3 className={style.h3}>당신의 COFFEE에 로그인하세요!</h3>
        <div className={style.card}>
            <form className={style.form} onSubmit={loginHandler}>
                <label className={style.label}>ID</label>
                <input
                    className={style.input}
                    type="text"
                    placeholder="ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <label className={style.label}>Password</label>
                <input
                    className={style.input}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {loginError && <p className={style.errorMessage}>{loginError}</p>}
                <button className={style.button} type="submit">
                    Log in
                </button>
            </form>
            <Link to="signup">Sign up</Link>
        </div>
    </div>
);

}

export default LoginPage;
