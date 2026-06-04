import styles from "../Buttons/Button.component.module.css";

export const PrimaryButton = ({ type, text ,children,  onClick }) => {
  return (
    <button onClick={onClick} type={type} className={styles.submitBtn}>
      {text}
      <div className={styles.iconBox}>
       {children}
      </div>
    </button>
  );
};
