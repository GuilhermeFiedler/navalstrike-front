import { getShipImage } from "../../components/ships/shipImages";
import { SHIP_TYPES, SHIP_LABELS } from "../../constants";
import NavalCard from "../../components/NavalCard/NavalCard";
import Button from "../../components/button/Button";
import styles from "./Dock.module.css";

export default function SkinCard({ pack, isEquipped, onEquip, onUnequip }) {
  const slug = pack.slug;

  return (
    <NavalCard className={`${styles.skinCard} ${isEquipped ? styles.skinCardEquipped : ""}`}>
      <div className={styles.skinCardHeader}>
        <h3 className={styles.skinName}>{pack.name}</h3>
        {isEquipped && <span className={styles.equippedBadge}>EQUIPADA</span>}
      </div>

      <p className={styles.skinDescription}>{pack.description}</p>

      <div className={styles.shipPreview}>
        {SHIP_TYPES.map((type) => (
          <div key={type} className={styles.shipPreviewItem}>
            <img
              src={getShipImage(slug, type)}
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
          <Button variant="secondary" onClick={onUnequip}>
            Desequipar
          </Button>
        ) : (
          <Button variant="primary" onClick={() => onEquip(pack.id)}>
            Equipar
          </Button>
        )}
      </div>
    </NavalCard>
  );
}
