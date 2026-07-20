import { useEffect } from "react";
import styles from "./Explosion.module.css";

const TOTAL_DURATION = 900;

export default function Explosion({ onEnd }) {
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
