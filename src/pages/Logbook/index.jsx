import { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import api from "../../utils/api";
import styles from "./Logbook.module.css";

const PAGE_SIZE = 5;

export default function Logbook() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    setLoading(true);
    setError("");
    try {
      const [res] = await Promise.all([
        api.get("/matches/history"),
        new Promise((r) => setTimeout(r, 800)),
      ]);
      setHistory(res.data);
      setPage(0);
    } catch {
      setError("Erro ao carregar histórico de partidas");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }

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

  const victories = history.filter((m) => m.result === "VICTORY").length;
  const defeats = history.filter((m) => m.result === "DEFEAT").length;
  const totalPages = Math.ceil(history.length / PAGE_SIZE);
  const paginatedHistory = history.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Logbook</h1>
          <div className={styles.headerActions}>
            <button
              className={styles.btnRefresh}
              onClick={fetchHistory}
              disabled={loading}
            >
              Atualizar
            </button>
          </div>
        </header>

        {error && <p className={styles.error}>{error}</p>}

        {!loading && history.length > 0 && (
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statValue}>{history.length}</span>
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
        )}

        <div className={styles.matchList}>
          {paginatedHistory.map((match) => (
            <div key={match.id} className={styles.matchCard}>
              <div
                className={`${styles.matchIcon} ${
                  match.result === "VICTORY"
                    ? styles.matchIconVictory
                    : styles.matchIconDefeat
                }`}
              >
                {match.result === "VICTORY" ? "⚓" : "💀"}
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
                    match.result === "VICTORY"
                      ? styles.resultVictory
                      : styles.resultDefeat
                  }`}
                >
                  {match.result === "VICTORY" ? "Vitória" : "Derrota"}
                </span>
                {match.forfeit && (
                  <span className={styles.forfeitTag}>Desistência</span>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className={styles.loadingCard}>
              <span className={styles.loadingIcon}>⟳</span>
              <span className={styles.loadingText}>
                Consultando registros...
              </span>
            </div>
          )}

          {!loading && history.length === 0 && !error && (
            <div className={styles.emptyState}>
              <span>📋</span>
              <span className={styles.emptyText}>
                Nenhuma batalha registrada ainda.
              </span>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
            >
              ← Anterior
            </button>
            <span className={styles.pageInfo}>
              {page + 1} / {totalPages}
            </span>
            <button
              className={styles.pageBtn}
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages - 1}
            >
              Próxima →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
