import { Outlet, Link } from 'react-router-dom';
import { refresh } from '../apis/userapis/refresh';

const Layout = () => {
  // 토큰 재발급
  const refreshHandler = (event) => {
    event.preventDefault();
    refresh();
  };

  return (
    <div>
      {/* 상단 고정 Nav */}
      <nav>
        <ul>
          <li>
            <button onClick={refreshHandler}>토큰 재발급</button>
          </li>
          <li>
            <Link to="/">홈</Link>
          </li>
          <li>
            <Link to="/product">제품</Link>
          </li>
          <li>
            <Link to="/mypage">마이페이지</Link>
          </li>
        </ul>
      </nav>

      {/* <Outlet>을 통해, 자식 라우트(=MainPage, SignupPage 등)가 렌더링됨 */}
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
