import Sidebar from "../../components/sidebar/Sidebar";
import OceanBackground from "../../components/oceanBackground/OceanBackground";
import Button from "../../components/button/Button";
import useRanking from "../../hooks/useRanking";
import styles from "./Ranking.module.css";
import { GiTrophy } from "react-icons/gi";

function SortIndicator({ column, activeSort, direction }) {
  if (column !== activeSort) return null;
  return <span>{direction === "desc" ? " ▼" : " ▲"}</span>;
}

export default function Ranking() {
  const {
    players,
    loading,
    error,
    page,
    totalPages,
    sort,
    direction,
    goToPage,
    changeSort,
    refresh,
  } = useRanking();

  const PAGE_SIZE = 10;

  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.content}>
        <OceanBackground />
        <header className={styles.header}>
          <h1 className={styles.title}>Ranking</h1>
          <Button variant="ghost" onClick={refresh} disabled={loading}>
            Atualizar
          </Button>
        </header>

        {error && <p className={styles.error}>{error}</p>}

        {loading ? (
          <div className={styles.loadingState}>
            <span className={styles.loadingIcon}>⟳</span>
            <span className={styles.loadingText}>Carregando ranking...</span>
          </div>
        ) : players.length === 0 ? (
          <div className={styles.emptyState}>
            <span><GiTrophy /></span>
            <span className={styles.emptyText}>Nenhum jogador no ranking ainda.</span>
          </div>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.rankTable}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Comandante</th>
                    <th
                      className={styles.sortable}
                      onClick={() => changeSort("victories")}
                    >
                      Vitórias
                      <SortIndicator column="victories" activeSort={sort} direction={direction} />
                    </th>
                    <th
                      className={styles.sortable}
                      onClick={() => changeSort("defeats")}
                    >
                      Derrotas
                      <SortIndicator column="defeats" activeSort={sort} direction={direction} />
                    </th>
                    <th
                      className={styles.sortable}
                      onClick={() => changeSort("totalMatches")}
                    >
                      Partidas
                      <SortIndicator column="totalMatches" activeSort={sort} direction={direction} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, index) => (
                    <tr key={player.id}>
                      <td className={styles.rankPosition}>
                        {page * PAGE_SIZE + index + 1}
                      </td>
                      <td className={styles.rankName}>{player.name}</td>
                      <td className={styles.rankVictories}>{player.victories}</td>
                      <td className={styles.rankDefeats}>{player.defeats}</td>
                      <td>{player.totalMatches}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <Button
                  variant="ghost"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 0}
                >
                  ← Anterior
                </Button>
                <span className={styles.pageInfo}>
                  {page + 1} / {totalPages}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages - 1}
                >
                  Próxima →
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
