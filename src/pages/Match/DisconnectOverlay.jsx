import { useState, useEffect } from "react";
import styles from "./Match.module.css";

export default function DisconnectOverlay({ seconds }) {
  const [countdown, setCountdown] = useState(seconds);

  useEffect(() => {
    setCountdown(seconds);
  }, [seconds]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown > 0]);

  return (
    <div className={styles.disconnectOverlay}>
      <div className={styles.disconnectCard}>
        <span className={styles.disconnectIcon}>⚠</span>
        <h3 className={styles.disconnectTitle}>Oponente desconectou</h3>
        <p className={styles.disconnectText}>
          Aguardando reconexão...
        </p>
        <span className={styles.disconnectCountdown}>{countdown}s</span>
      </div>
    </div>
  );
}
