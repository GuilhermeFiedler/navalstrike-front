import styles from "./NavalCard.module.css";

export default function NavalCard({ children, className = "" }) {
  return (
    <div className={styles.navalCard}>
      <div className={styles.rivets}>
        <span className={styles.rivet} />
        <span className={styles.rivet} />
        <span className={styles.rivet} />
        <span className={styles.rivet} />
      </div>
      <div className={`${styles.inner} ${className}`}>
        {children}
      </div>
    </div>
  );
}
