import { SHIPS } from "./shipConfig";

export default function ShipList({ placedCount, currentIndex }) {
  return (
    <div className="ship-list">
      <h3>Navios</h3>
      <ul>
        {SHIPS.map((ship, i) => (
          <li
            key={ship.type}
            className={
              i < placedCount ? "placed" : i === currentIndex ? "current" : ""
            }
          >
            {ship.label} {i < placedCount ? "✓" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
