import Sidebar from "../../components/sidebar/Sidebar";
import OceanBackground from "../../components/oceanBackground/OceanBackground";
import Button from "../../components/button/Button";
import useHistory from "../../hooks/useHistory";
import StatsRow from "./StatsRow";
import MatchHistoryCard from "./MatchHistoryCard";
import Pagination from "./Pagination";
import styles from "./Logbook.module.css";
import { FaClipboardList } from "react-icons/fa";

export default function Logbook() {
  const {
    history,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    victories,
    defeats,
    goToPage,
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
            <Button
              variant="ghost"
              onClick={() => fetchHistory(0)}
              disabled={loading}
            >
              Atualizar
            </Button>
          </div>
        </header>

        {error && <p className={styles.error}>{error}</p>}

        {!loading && totalElements > 0 && (
          <StatsRow
            total={totalElements}
            victories={victories}
            defeats={defeats}
          />
        )}

        <div className={styles.matchList}>
          {history.map((match) => (
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
          onPageChange={goToPage}
        />
      </main>
    </div>
  );
}
