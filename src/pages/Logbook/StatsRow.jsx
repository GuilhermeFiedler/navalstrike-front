import styles from "./Logbook.module.css";

export default function StatsRow({ total, victories, defeats }) {
  return (
    <div className={styles.statsRow}>
      <div className={styles.statCard}>
        <span className={styles.statValue}>{total}</span>
        <span className={styles.statLabel}>Batalhas</span>
      </div>
      <div className={`${styles.statCard} ${styles.statVictory}`}>
        <span className={styles.statValue}>{victories}</span>
        <span className={styles.statLabel}>Vitórias</span>
      </div>
      <div className={`${styles.statCard} ${styles.statDefeat}`}>
        <span className={styles.statValue}>{defeats}</span>
        <span className={styles.statLabel}>Derrotas</span>
      </div>
    </div>
  );
}
