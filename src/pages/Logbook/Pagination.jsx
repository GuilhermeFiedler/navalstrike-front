import styles from "./Logbook.module.css";
import Button from "../../components/button/Button";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className={styles.pagination}>
      <Button
        variant="ghost"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        ← Anterior
      </Button>
      <span className={styles.pageInfo}>
        {page + 1} / {totalPages}
      </span>
      <Button
        variant="ghost"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
      >
        Próxima →
      </Button>
    </div>
  );
}
