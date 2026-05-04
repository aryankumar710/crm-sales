import styles from "../InputFields/InputField.component.module.css";

export const FileInputField = ({type, name, label, accept, onChange, required}) => {
  return (
    <div className={styles.inputBox}>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        accept={accept}
        onChange={onChange}
        required = {required}
      />
    </div>
  );
};
