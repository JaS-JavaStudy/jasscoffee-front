import React from 'react';
import ReactDOM from 'react-dom';
import styles from './Modal.module.css'; // CSS Module import

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
