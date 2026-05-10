import styles from "../Buttons/Button.component.module.css";

export const TertiaryButton = ({children, onClick}) => {
    return(
        <button onClick={onClick} className={styles.tertiaryButton}>
            {children}
        </button>
    )
}