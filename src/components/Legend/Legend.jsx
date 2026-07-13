import styles from "./Legend.module.css";
import acertoImg from "../../assets/acerto.png";
import erroImg from "../../assets/erro.png";
import navioAfundadoImg from "../../assets/navioafundado.png";

export default function Legend() {
  return (
    <div className={styles.legend}>
      <h4 className={styles.title}>Legenda</h4>
      <div className={styles.item}>
        <img src={acertoImg} alt="Acerto" className={styles.icon} draggable={false} />
        <span>Acerto</span>
      </div>
      <div className={styles.item}>
        <img src={erroImg} alt="Erro" className={styles.icon} draggable={false} />
        <span>Erro</span>
      </div>
      <div className={styles.item}>
        <img src={navioAfundadoImg} alt="Afundado" className={styles.icon} draggable={false} />
        <span>Afundado</span>
      </div>
    </div>
  );
}
