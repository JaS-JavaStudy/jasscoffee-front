import React from "react";
import styles from "./NotFoundPage.module.css";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>404 - Page Not Found</h1>
      <p className={styles.message}>이 페이지는 존재하지 않습니다.</p>
      <p className={styles.message}>다시 한번 url을 확인해주세요.</p>
      <Link to="/" className={styles.link}>
        자스커피 홈으로 가기
      </Link>
    </div>
  );
};

export default NotFoundPage;
