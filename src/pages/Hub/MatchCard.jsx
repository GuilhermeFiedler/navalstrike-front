import styles from "./Hub.module.css";
import Button from "../../components/button/Button";
import { GiAnchor, GiWaves } from "react-icons/gi";

export default function MatchCard({ match, userId, onConnect, onJoin }) {
  const playerCount = match.playerCount ?? match.players?.length ?? 1;
  const isFull = playerCount >= 2;

  function isUserInMatch() {
    if (match.hostId === userId) return true;
    if (match.players?.some((p) => p.id === userId)) return true;
    if (match.guestId === userId) return true;
    return false;
  }

  const inMatch = isUserInMatch();

  return (
    <div className={styles.matchCard}>
      <div
        className={`${styles.matchIcon} ${
          isFull ? styles.matchIconActive : styles.matchIconWaiting
        }`}
      >
        {isFull ? <GiWaves /> : <GiAnchor />}
      </div>

      <div className={styles.matchInfo}>
        <span className={styles.matchName}>
          Partida de {match.hostName || "Usuario"}...
        </span>
        <span className={styles.matchBadge}>
          {playerCount}/2 Commanders
        </span>
      </div>

      <div className={styles.matchActions}>
        <span
          className={`${styles.statusTag} ${
            isFull ? styles.statusActive : styles.statusWaiting
          }`}
        >
          {isFull ? "Combate Ativo" : "Aguardando Rival"}
        </span>

        {isFull && inMatch ? (
          <Button variant="primary" onClick={() => onConnect(match.id)}>
            Conectar
          </Button>
        ) : !isFull && !inMatch ? (
          <Button variant="primary" onClick={() => onJoin(match.id)}>
            Desafiar
          </Button>
        ) : !isFull && inMatch ? (
          <Button variant="primary" onClick={() => onConnect(match.id)}>
            Conectar
          </Button>
        ) : null}
      </div>
    </div>
  );
}
