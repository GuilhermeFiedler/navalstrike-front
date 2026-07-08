import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: "comando", label: "COMANDO", icon: "🎮", path: "/hub" },
    { id: "hangar", label: "HANGAR", icon: "⚓", path: "/hangar" },
    { id: "logbook", label: "LOGBOOK", icon: "📋", path: "/logbook" },
  ];

  function isActive(path) {
    return location.pathname === path;
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userSection}>
        <span className={styles.userIcon}>👤</span>
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
    </aside>
  );
}
