// 장바구니 모달 관련 import
import Modal from '../components/cartlist/Modal';
import CartList from '../components/cartlist/CartList';

// 부트스트랩 CSS
import 'bootstrap/dist/css/bootstrap.min.css';

// 새로 만든 CSS 파일
import './Navbar.css';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, NavLink} from 'react-router-dom';
import { getUser } from '../apis/userapis/getuser';
import { logout } from '../apis/userapis/logout';

const Navbar = () => {
    const [user, setUser] = useState();
    const [isCartModalOpen, setCartModalOpen] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        getUser().then(res => setUser(res));
    }, []);

    useEffect(() => {
        if (location.pathname === '/payment') {
            setCartModalOpen(false);
        }
    }, [location]);

    const logoutHandler = (event) => {
        event.preventDefault();
        logout(navigate);
    };

    const openCartModal = () => setCartModalOpen(true);
    const closeCartModal = () => setCartModalOpen(false);

    return (
        <div className="page-container">
            {/* 네비게이션 바 */}
            <nav className="navbar navbar-expand-lg navbar-light custom-navbar">
                <div className="container">
                    <NavLink
                        to="/product"
                        className="navbar-brand text-uppercase fw-bolder"
                        style={{ letterSpacing: '0.5px' }}
                    >
                        JASS COFFEE
                    </NavLink>

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

                    <div className="collapse navbar-collapse justify-content-end" id="navbarSupportedContent">
                        <ul className="navbar-nav align-items-center">
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

                            <li className="nav-item ms-3">
                                {user && (
                                    <>
                                        <button
                                            className="cart-button"
                                            onClick={openCartModal}
                                            aria-label="장바구니 열기"
                                        >
                                            장바구니 보기
                                        </button>
                                        <button className="cart-button" onClick={logoutHandler}>
                                            Logout
                                        </button>
                                    </>
                                )}
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <Modal isOpen={isCartModalOpen} onClose={closeCartModal}>
                <CartList closeCartModal={closeCartModal} />
            </Modal>
        </div>
    );
};

export default Navbar;
