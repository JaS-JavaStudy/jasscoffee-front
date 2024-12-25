// src/pages/RootLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar'; // 아래에서 만든 Navbar

function RootLayout() {
  return (
    <div className="root-layout">
      {/* 모든 페이지에서 공통으로 보이는 Navbar */}
      <Navbar />

      {/* 자식 라우트가 이 위치에서 교체됨 */}
      <Outlet />
    </div>
  );
}

export default RootLayout;
