import styles from "../Buttons/Button.component.module.css";

export const PrimaryButton = ({ type, text ,children }) => {
  return (
    <button type={type} className={styles.submitBtn}>
      {text}
      <div className={styles.iconBox}>
       {children}
      </div>
    </button>
  );
};
