import { useEffect } from "react";
import styles from "./MissAnim.module.css";

const TOTAL_DURATION = 800;

export default function MissAnim({ onEnd }) {
  useEffect(() => {
    const timer = setTimeout(() => onEnd?.(), TOTAL_DURATION);
    return () => clearTimeout(timer);
  }, [onEnd]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.sprite} />
    </div>
  );
}
