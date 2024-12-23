// 장바구니 모달 관련 import
import Modal from '../components/cartlist/Modal';
import CartList from '../components/cartlist/CartList';

// 부트스트랩 CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// 새로 만든 CSS 파일
import './LayoutNavbar.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Outlet, NavLink } from 'react-router-dom';
import { refresh } from '../apis/userapis/refresh';
import { getUser } from '../apis/userapis/getuser';
import { logout } from '../apis/userapis/logout';
import { isStaff } from '../apis/userapis/isStaff';

// 홈 및 토큰 재발급 Layout
const Layout = () => {

    const [user, setUser] = useState()
    const [staff, setStaff] = useState()

    const navigate = useNavigate()

    useEffect(() => {
        getUser().then(res => {
            setUser(res)
        isStaff().then(res => {
            setStaff(res)
        })
        })


    })
    // 로그아웃 
    const logoutHandler = (event) => {
        event.preventDefault();
        logout(navigate);
    }

    // 토큰 재발급
    const refreshHandler = (event) => {
        event.preventDefault();
        refresh();
    };

    // 장바구니 모달
    const [isCartModalOpen, setCartModalOpen] = useState(false);
    const openCartModal = () => setCartModalOpen(true);
    const closeCartModal = () => setCartModalOpen(false);

    return (
        <div className="page-container">
            {/* 네비게이션 바 */}
            <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
                <div className="container">
                    {/* 브랜드 로고 (여기서는 여전히 Link로, NavLink 사용해도 무방) */}
                    <NavLink
                        to="/product"
                        className="navbar-brand text-uppercase fw-bolder"
                        style={{ letterSpacing: '0.5px' }}
                    >
                        JASS COFFEE
                    </NavLink>

                    {/* 모바일 토글 버튼 */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div
                        className="collapse navbar-collapse justify-content-end"
                        id="navbarSupportedContent"
                    >
                        <ul className="navbar-nav align-items-center">
                            {/* 토큰 재발급 버튼 */}
                            <li className="nav-item mx-3">
                                <button
                                    onClick={refreshHandler}
                                    className="btn btn-link nav-link p-0 fw-bold"
                                >
                                    토큰 재발급
                                </button>
                            </li>

                            {/* 홈: NavLink로 바꾸고, active 클래스 지정 */}
                            <li className="nav-item mx-3">
                                <NavLink
                                    to="/product"
                                    className={({ isActive }) =>
                                        isActive ? 'nav-link fw-bold fs-6 active-link' : 'nav-link fw-bold fs-6'
                                    }
                                >
                                    홈
                                </NavLink>
                            </li>

                            {/* 제품 */}
                            <li className="nav-item mx-3">
                                <NavLink
                                    to="/product"
                                    className={({ isActive }) =>
                                        isActive ? 'nav-link fw-bold fs-6 active-link' : 'nav-link fw-bold fs-6'
                                    }
                                >
                                    제품
                                </NavLink>
                            </li>

                            {/* 마이페이지 */}
                            <li className="nav-item mx-3">
                                <NavLink
                                    to="/mypage"
                                    className={({ isActive }) =>
                                        isActive ? 'nav-link fw-bold fs-6 active-link' : 'nav-link fw-bold fs-6'
                                    }
                                >
                                    마이페이지
                                </NavLink>
                            </li>

                            {/* 장바구니 버튼 */}
                            <li className="nav-item ms-3">
                                <button
                                    className="cart-button"
                                    onClick={openCartModal}
                                    aria-label="장바구니 열기"
                                >
                                    장바구니 보기
                                </button>
                            {/* 로그아웃 버튼 */}    
                            {user ? <button className='cart-button'
                                onClick={logoutHandler}>Logout</button>
                            : ""}
                            {/* 관리자 버튼 */}    
                            {staff ? "관리자" : "유저"}

                            </li>
                        </ul>
                    </div>
                </div>
            </nav>


            {/* Outlet */}
            <div className="content">
                <Outlet />
            </div>

            {/* 장바구니 모달 */}
            <Modal isOpen={isCartModalOpen} onClose={closeCartModal}>
                <CartList closeCartModal={closeCartModal} />
            </Modal>
        </div>
    );
};

export default Layout;
