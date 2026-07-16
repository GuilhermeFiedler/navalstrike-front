import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import styles from "./LogoutButton.module.css";
import { GiExitDoor } from "react-icons/gi";


export default function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <button className={styles.logoutBtn} onClick={handleLogout}>
      <span className={styles.icon}><GiExitDoor /></span>
      <span className={styles.label}>SAIR</span>
    </button>
  );
}
