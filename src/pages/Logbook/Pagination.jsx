import styles from "./Logbook.module.css";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        ← Anterior
      </button>
      <span className={styles.pageInfo}>
        {page + 1} / {totalPages}
      </span>
      <button
        className={styles.pageBtn}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        Próxima →
      </button>
    </div>
  );
}
