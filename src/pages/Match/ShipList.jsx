import { SHIPS } from "./shipConfig";
import styles from "./Match.module.css";

export default function ShipList({ placedCount, currentIndex }) {
  return (
    <div className={styles.shipList}>
      <h3>Navios</h3>
      <ul>
        {SHIPS.map((ship, i) => (
          <li
            key={ship.type}
            className={
              i < placedCount
                ? styles.shipListPlaced
                : i === currentIndex
                ? styles.shipListCurrent
                : ""
            }
          >
            {ship.label} {i < placedCount ? "✓" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
