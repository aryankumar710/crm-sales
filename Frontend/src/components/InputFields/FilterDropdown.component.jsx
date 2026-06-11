import styles from "../InputFields/InputField.component.module.css";

export const FilterDropdown = ({label, value, options, onChange, children}) => {
    return(
        <>
        <div className={styles.filterAlignment}>
            {children}
            <div className={styles.inputBox}>
                <label htmlFor={name}>{label}</label>
                <select value={value} name={name} onChange={onChange}>
                  <option value="">Select</option>
                  {/* {options.map((opt) => (
                    <option key={opt._id} value={opt[name]}>
                      {opt[name]}
                    </option>
                  ))}          */}
                </select>
              </div>
        </div>
              
        </>
    )
}