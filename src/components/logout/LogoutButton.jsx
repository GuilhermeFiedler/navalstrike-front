import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import styles from "./LogoutButton.module.css";

export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <button className={styles.logoutBtn} onClick={handleLogout}>
      <span className={styles.icon}>←</span>
      <span className={styles.label}>SAIR</span>
    </button>
  );
}
