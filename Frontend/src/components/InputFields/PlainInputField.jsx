import styles from "../InputFields/InputField.module.css"

export const PlainInputField = ({ type,placeholder, value, name , onChange, required, label}) => {
  return (
    <div className={styles.inputBox}>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        value={value}
        name={name}
        onChange={onChange}
        required = {required}
      />
    </div>
  );
};
