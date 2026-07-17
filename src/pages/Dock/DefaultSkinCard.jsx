import { DEFAULT_IMAGES } from "../../components/ships/shipImages";
import { SHIP_TYPES, SHIP_LABELS } from "../../constants";
import NavalCard from "../../components/NavalCard/NavalCard";
import Button from "../../components/button/Button";
import styles from "./Dock.module.css";

export default function DefaultSkinCard({ isEquipped, onSelect }) {
  return (
    <NavalCard className={`${styles.skinCard} ${isEquipped ? styles.skinCardEquipped : ""}`}>
      <div className={styles.skinCardHeader}>
        <h3 className={styles.skinName}>Padrão</h3>
        {isEquipped && <span className={styles.equippedBadge}>EQUIPADA</span>}
      </div>

      <p className={styles.skinDescription}>Visual padrão da frota naval.</p>

      <div className={styles.shipPreview}>
        {SHIP_TYPES.map((type) => (
          <div key={type} className={styles.shipPreviewItem}>
            <img
              src={DEFAULT_IMAGES[type]}
              alt={SHIP_LABELS[type]}
              className={styles.shipPreviewImg}
              draggable={false}
            />
            <span className={styles.shipPreviewLabel}>{SHIP_LABELS[type]}</span>
          </div>
        ))}
      </div>

      <div className={styles.skinCardActions}>
        {isEquipped ? (
          <span className={styles.equippedText}>Visual ativo</span>
        ) : (
          <Button variant="primary" onClick={onSelect}>
            Usar padrão
          </Button>
        )}
      </div>
    </NavalCard>
  );
}
