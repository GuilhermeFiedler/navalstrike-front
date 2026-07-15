import { getShipImage } from "../../components/ships/shipImages";
import styles from "./Dock.module.css";

const SHIP_TYPES = ["CARRIER", "BATTLESHIP", "CRUISER", "SUBMARINE", "DESTROYER"];

const SHIP_LABELS = {
  CARRIER: "Porta-aviões",
  BATTLESHIP: "Encouraçado",
  CRUISER: "Cruzador",
  SUBMARINE: "Submarino",
  DESTROYER: "Destroyer",
};

export default function SkinCard({ pack, isEquipped, onEquip, onUnequip }) {
  const slug = pack.slug;

  return (
    <div className={`${styles.skinCard} ${isEquipped ? styles.skinCardEquipped : ""}`}>
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
          <button className={styles.btnUnequip} onClick={onUnequip}>
            Desequipar
          </button>
        ) : (
          <button className={styles.btnEquip} onClick={() => onEquip(pack.id)}>
            Equipar
          </button>
        )}
      </div>
    </div>
  );
}
