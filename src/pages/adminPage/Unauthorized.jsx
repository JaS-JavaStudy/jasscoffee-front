import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Unauthorized.module.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>403 - 권한이 없습니다</h1>
      <p className={styles.message}>이 페이지에 접근할 권한이 없습니다.</p>
      <button onClick={goToLogin} className={styles.button}>
        로그인 페이지로 이동
      </button>
    </div>
  );
};

export default Unauthorized;
