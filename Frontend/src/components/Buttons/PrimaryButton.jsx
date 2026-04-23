import styles from "../Buttons/Button.module.css";

export const PrimaryButton = ({ type, text ,children }) => {
  return (
    <button type={type} className={styles.submitBtn}>
      {text}
      <div className={styles.arrowBox}>
       {children}
      </div>
    </button>
  );
};
