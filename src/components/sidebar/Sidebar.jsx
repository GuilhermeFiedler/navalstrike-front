import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LogoutButton from "../logout/LogoutButton";
import styles from "./Sidebar.module.css";
import { GiAnchor, GiPirateFlag, GiBookmark, GiTrophy } from "react-icons/gi";
import { FaGamepad, FaUser } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { id: "comando", label: "COMANDO", icon: <FaGamepad />, path: "/hub" },
    { id: "doca", label: "DOCA", icon: <GiAnchor />, path: "/dock" },
    { id: "ranking", label: "RANKING", icon: <GiTrophy />, path: "/ranking" },
    { id: "logbook", label: "LOGBOOK", icon: <GiBookmark />, path: "/logbook" },
  ];

  function isActive(path) {
    return location.pathname === path;
  }

  function handleNavigate(path) {
    navigate(path);
    setOpen(false);
  }

  return (
    <>
      <button
        className={styles.hamburger}
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <HiMenu />
      </button>

      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
        <button
          className={styles.closeBtn}
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        >
          <HiX />
        </button>

        <div className={styles.userSection}>
          <span className={styles.userIcon}><FaUser /></span>
          <span className={styles.userName}>{user?.name || "User"}</span>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${isActive(item.path) ? styles.active : ""}`}
              onClick={() => handleNavigate(item.path)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        <LogoutButton />
      </aside>
    </>
  );
}
