import { createPortal } from "react-dom";
import styles from "../Modals/Modal.component.module.css"

export const Modal = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return createPortal(
    <div className="modal-overlay" >
      <div className={styles.formContainer} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};
