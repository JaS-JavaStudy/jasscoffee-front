import React from 'react';
import { Link } from 'react-router-dom';
import { refresh } from '../apis/refresh';

const Layout = ({ children }) => {

    const refreshHandler = (event) => {
        event.preventDefault();
        refresh();
    }

    return (
        <div>
            {/* 상단 고정 Nav */}
            <nav>
                <ul>
                    <li><button onClick={refreshHandler}>토큰 재발급</button></li>
                    <li><Link to="/">홈</Link></li>
                    <li><Link to="/product">제품</Link></li>
                </ul>
            </nav>
            <div className="content">
                {children} {/* 페이지 콘텐츠 */}
            </div>
        </div>
    );
};

export default Layout;
