import MatchCard from "./MatchCard";
import styles from "./Hub.module.css";
import { GiAnchor } from "react-icons/gi";

export default function MatchList({ matches, loading, userId, onConnect, onJoin }) {
  return (
    <div className={styles.matchList}>
      {matches.map((match) => (
        <MatchCard
          key={match.id}
          match={match}
          userId={userId}
          onConnect={onConnect}
          onJoin={onJoin}
        />
      ))}

      {loading && (
        <div className={styles.loadingCard}>
          <span className={styles.loadingIcon}>⟳</span>
          <span className={styles.loadingText}>Buscando novos setores...</span>
        </div>
      )}

      {!loading && matches.length === 0 && (
        <div className={styles.emptyState}>
          <span><GiAnchor /></span>
          <span className={styles.emptyText}>
            Nenhuma partida disponível no momento.
          </span>
        </div>
      )}
    </div>
  );
}
