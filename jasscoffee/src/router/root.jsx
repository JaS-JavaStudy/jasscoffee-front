// router/root.jsx
import { Outlet } from 'react-router-dom';

export default function Root() {
  return (
    <div className="container-fluid">
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
}