import Button from "../../components/button/Button";
import styles from "./Hub.module.css";

export default function HubHeader({ onRefresh, onCreate, loading, creating }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Listagem de Partidas</h1>
      <div className={styles.headerActions}>
        <Button
          variant="primary"
          onClick={onRefresh}
          disabled={loading}
        >
          Atualizar Lista
        </Button>
        <Button
          variant="secondary"
          onClick={onCreate}
          disabled={creating}
        >
          {creating ? "Criando..." : "Nova Partida"}
        </Button>
      </div>
    </header>
  );
}
