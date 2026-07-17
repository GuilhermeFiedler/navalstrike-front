import styles from "./Logbook.module.css";
import { GiAnchor, GiSkullCrossedBones } from "react-icons/gi";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MatchHistoryCard({ match }) {
  const isVictory = match.result === "VICTORY";

  return (
    <div className={styles.matchCard}>
      <div
        className={`${styles.matchIcon} ${
          isVictory ? styles.matchIconVictory : styles.matchIconDefeat
        }`}
      >
        {isVictory ? <GiAnchor /> : <GiSkullCrossedBones />}
      </div>

      <div className={styles.matchInfo}>
        <span className={styles.matchOpponent}>
          vs {match.opponentName}
        </span>
        <span className={styles.matchDate}>
          {formatDate(match.finishedAt)}
        </span>
      </div>

      <div className={styles.matchResult}>
        <span
          className={`${styles.resultTag} ${
            isVictory ? styles.resultVictory : styles.resultDefeat
          }`}
        >
          {isVictory ? "Vitória" : "Derrota"}
        </span>
        {match.forfeit && (
          <span className={styles.forfeitTag}>Desistência</span>
        )}
      </div>
    </div>
  );
}
