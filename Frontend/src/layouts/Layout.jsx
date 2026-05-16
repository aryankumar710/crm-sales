// Layout.jsx
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header/Header.component.jsx";
import styles from "../layouts/Layout.module.css";

function VerticalLayout() {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.flex}>
        <Outlet />
      </div>
    </div>
  );
}

export { VerticalLayout };
