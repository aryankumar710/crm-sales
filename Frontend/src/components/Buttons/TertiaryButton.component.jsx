import styles from "../Buttons/Button.component.module.css";

export const TertiaryButton = ({children}) => {
    return(
        <button className={styles.tertiaryButton}>
            {children}
        </button>
    )
}