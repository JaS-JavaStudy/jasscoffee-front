import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Modal from '../components/cartlist/Modal';
import CartList from '../components/cartlist/CartList';
import { getUser } from '../apis/userapis/getuser';
import { logout } from '../apis/userapis/logout';
import { isStaff } from '../apis/userapis/isStaff';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isCartModalOpen, setCartModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isStaffStatus, setIsStaffStatus] = useState(false);

  // Fetch user information when the component mounts or updates
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUser();
      const staffCheck = await isStaff();  // 관리자 navbar
      setUser(res);
      setIsStaffStatus(staffCheck);
    };
    fetchUser();
  }, [location.pathname]); // 사용자 상태를 경로 변경에 따라 업데이트

  const handleLogout = async (event) => {
    event.preventDefault();
    await logout(navigate);
    setUser(null); // Clear user state after logout
  };

  const openCartModal = () => setCartModalOpen(true);
  const closeCartModal = () => setCartModalOpen(false);

  return (
    <header className={styles.navbarContainer}>
      {/* Brand */}
      <NavLink
        to="/product"
        className={styles.navbarBrand}
        aria-label="JASS COFFEE 홈으로 이동"
      >
        JASS COFFEE
      </NavLink>

      {/* Navigation Menu */}
      <nav className={styles.navbarMenu}>
        <NavLink
          to="/product"
          className={({ isActive }) =>
            isActive ? `${styles.navbarLink} ${styles.active}` : styles.navbarLink
          }
        >
          홈
        </NavLink>
        <NavLink
          to="/mypage"
          className={({ isActive }) =>
            isActive ? `${styles.navbarLink} ${styles.active}` : styles.navbarLink
          }
        >
          마이페이지
        </NavLink>

        {/* 관리자 전용 링크 */}
        {isStaffStatus && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? `${styles.navbarLink} ${styles.active}` : styles.navbarLink
            }
          >
            관리자
          </NavLink>
        )}

      
        {user ? (
          <>
            <button
              className={styles.navbarButton}
              onClick={openCartModal}
              aria-label="장바구니 보기"
            >
              장바구니
            </button>
            <button
              className={styles.navbarButton}
              onClick={handleLogout}
              aria-label="로그아웃"
            >
              로그아웃
            </button>
          </>
        ) : (
          <NavLink to="/login" className={styles.navbarButton}>
            로그인
          </NavLink>
        )}
      </nav>

      {/* Cart Modal */}
      <Modal isOpen={isCartModalOpen} onClose={closeCartModal}>
        <CartList closeCartModal={closeCartModal} />
      </Modal>
    </header>
  );
};

export default Navbar;
