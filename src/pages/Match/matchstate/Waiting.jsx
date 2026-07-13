import styles from "../Match.module.css";

export default function Waiting({ code }) {
  return (
    <div className={styles.waiting}>
      <h2>Aguardando oponente...</h2>
      <p>Compartilhe o código da sala:</p>
      <div className={styles.codeDisplay}>{code || "..."}</div>
      <p>O jogo começará automaticamente quando alguém entrar.</p>
    </div>
  );
}
