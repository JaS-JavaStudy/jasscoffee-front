import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { refresh } from '../apis/userapis/refresh';
import { getUser } from '../apis/userapis/getuser';
import { logout } from '../apis/userapis/logout';
// 홈 및 토큰 재발급 Layout
const Layout = ({ children }) => {

    const [user, setUser] = useState()

    const navigate = useNavigate()

    useEffect(() => {
        getUser().then(res => {
            setUser(res)
        })
        
        
    })

    // 토큰 재발급 버튼 클릭시 refresh api 호출
    const refreshHandler = (event) => {
        event.preventDefault();
        refresh();
    }

    // 로그아웃 
        const logoutHandler = (event) => {
            // event.preventDefault();
            logout(navigate);
        }

    return (
        <div>
            {/* 상단 고정 Nav */}
            <nav>
                <ul>
                    <li><button onClick={refreshHandler}>토큰 재발급</button></li>
                    <li><Link to="/">홈</Link></li>
                    <li><Link to="/product">제품</Link></li>
                    <li>
                        {user ? <button onClick={logoutHandler}>로그아웃</button> : "null"}
                    </li>
                </ul>
            </nav>
            <div className="content">
                {children} {/* 페이지 콘텐츠 */}
            </div>
        </div>
    );
};

export default Layout;
