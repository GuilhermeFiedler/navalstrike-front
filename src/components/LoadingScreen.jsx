import { useState, useEffect } from "react";
import styles from "./LoadingScreen.module.css";
import { GiAnchor } from "react-icons/gi";

const STATUS_MESSAGES = [
  "DECODIFICANDO FREQUÊNCIAS INIMIGAS...",
  "CALIBRANDO MATRIZES DE SONAR...",
  "IMPLANTANDO ATIVOS DA FROTA...",
  "SINCRONIZANDO MAPA TÁTICO...",
  "BUSCANDO INTELIGÊNCIA DO SETOR 7-G...",
  "CRIPTOGRAFANDO CANAL DE COMANDO...",
];

const TOTAL_SEGMENTS = 24;

export default function LoadingScreen({ progress = 0 }) {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const filledSegments = Math.round((progress / 100) * TOTAL_SEGMENTS);
  const percent = Math.min(Math.round(progress), 100);

  function getLoadingLabel() {
    if (percent >= 100) return "CONEXÃO CONCLUÍDA";
    if (percent > 80) return "FINALIZANDO COMANDO...";
    if (percent > 60) return "VINCULANDO ATIVOS...";
    if (percent > 30) return "CARREGANDO DADOS...";
    return "INICIALIZANDO SISTEMA...";
  }

  return (
    <div className={styles.screen}>
      <div className={styles.crtOverlay}></div>
      <div className={styles.scanline}></div>

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.anchor}><GiAnchor /></span>
          <h1 className={styles.title}>NAVALSTRIKE</h1>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.headerTag}>LINK SEGURO</span>
          <span className={styles.headerTag}>
            <span className={styles.dot}></span>
            UPLINK: ATIVO
          </span>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.radar}>
          <div className={styles.radarGrid1}></div>
          <div className={styles.radarGrid2}></div>
          <div className={styles.radarGrid3}></div>
          <div className={styles.radarAxisH}></div>
          <div className={styles.radarAxisV}></div>
          <div className={styles.radarSweep}></div>
          <div className={styles.blip1}></div>
          <div className={styles.blip2}></div>
          <div className={styles.radarCenter}>
            SONAR<br />ATIVO
          </div>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span>{getLoadingLabel()}</span>
            <span className={styles.percent}>{percent}%</span>
          </div>

          <div className={styles.progressBar}>
            {Array.from({ length: TOTAL_SEGMENTS }, (_, i) => (
              <div
                key={i}
                className={`${styles.segment} ${i < filledSegments ? styles.segmentFilled : ""}`}
              />
            ))}
          </div>

          <div className={styles.statusScroll}>
            {STATUS_MESSAGES[statusIndex]}
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span>LAT: 45.23432</span>
          <span>LNG: -12.98432</span>
        </div>
        <div className={styles.footerRight}>
          <span className={styles.dot}></span>
          <span>FLUXO DE DADOS EM TEMPO REAL 82.02</span>
        </div>
      </footer>
    </div>
  );
}
