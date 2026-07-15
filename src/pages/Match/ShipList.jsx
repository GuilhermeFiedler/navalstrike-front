import { SHIPS } from "./shipConfig";
import styles from "./Match.module.css";
import { FaCheck } from "react-icons/fa";

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
            {ship.label} {i < placedCount ? <FaCheck /> : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
