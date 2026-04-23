import styles from "../InputFields/InputField.module.css";

export const PasswordInputField = (
 { name,
  label,
  type,
  placeholder,
  value,
  onChange,
  required,}
) => {
  return (
    <div className={styles.inputBox}>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};
