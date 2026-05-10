import styles from "../InputFields/InputField.component.module.css";
import { createPortal } from "react-dom";


export const Dropdown = ({name, label,value,options, onChange}) => {
    return (
        <div className={styles.inputBox}>
            <label htmlFor={name}>{label}</label>
            <select value={value} name={name} onChange={onChange} >
                <option value="">Select</option>
                {options.map((opt)=> (
                    <option key={opt._id} value={opt[name]}>
                        {opt[name]}
                    </option>
                ))}
            </select>
        </div>
    )
}