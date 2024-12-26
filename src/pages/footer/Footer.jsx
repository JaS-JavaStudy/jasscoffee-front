// src/components/Footer.jsx
import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerContent}>
        <div className={styles.brand}>
          <a href="https://github.com/JaS-JavaStudy/jasscoffee-front" className={styles.brandLink}>
            JASS Github
          </a>
        </div>
        <div className={styles.contact}>
          <p>Contact: jiwonameginoyatchanwon@ssafy.com</p>
          <p>Team: 강현호 권남희 김지원 박주찬 신희원 임남기</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
