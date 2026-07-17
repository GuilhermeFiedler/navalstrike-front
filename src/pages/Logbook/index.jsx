import Sidebar from "../../components/sidebar/Sidebar";
import OceanBackground from "../../components/oceanBackground/OceanBackground";
import useHistory from "../../hooks/useHistory";
import StatsRow from "./StatsRow";
import MatchHistoryCard from "./MatchHistoryCard";
import Pagination from "./Pagination";
import styles from "./Logbook.module.css";
import { FaClipboardList } from "react-icons/fa";

export default function Logbook() {
  const {
    history,
    paginatedHistory,
    loading,
    error,
    page,
    totalPages,
    victories,
    defeats,
    setPage,
    fetchHistory,
  } = useHistory();

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <OceanBackground />
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
          <StatsRow
            total={history.length}
            victories={victories}
            defeats={defeats}
          />
        )}

        <div className={styles.matchList}>
          {paginatedHistory.map((match) => (
            <MatchHistoryCard key={match.id} match={match} />
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
              <span><FaClipboardList /></span>
              <span className={styles.emptyText}>
                Nenhuma batalha registrada ainda.
              </span>
            </div>
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
}
