import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LogoutButton from "../logout/LogoutButton";
import styles from "./Sidebar.module.css";
import { GiAnchor, GiPirateFlag, GiBookmark } from "react-icons/gi";
import { FaGamepad, FaUser } from "react-icons/fa";

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "comando", label: "COMANDO", icon: <FaGamepad />, path: "/hub" },
    { id: "doca", label: "DOCA", icon: <GiAnchor />, path: "/dock" },
    { id: "logbook", label: "LOGBOOK", icon: <GiBookmark />, path: "/logbook" },
  ];

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userSection}>
        <span className={styles.userIcon}><FaUser /></span>
        <span className={styles.userName}>{user?.name || "User"}</span>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navItem} ${isActive(item.path) ? styles.active : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </nav>

      <LogoutButton />
    </aside>
  );
}
