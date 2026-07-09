import { useState } from "react";
import api from "../../../utils/api";
import { SHIPS } from "../shipConfig";
import { getShipCoords, hasCollision } from "./placingUtils";
import PlacingBoard from "./PlacingBoard";
import ShipList from "../ShipList";
import styles from "../Match.module.css";

export default function Placing({ matchId, onPlaced }) {
  const [placedShips, setPlacedShips] = useState([]);
  const [currentShipIndex, setCurrentShipIndex] = useState(0);
  const [orientation, setOrientation] = useState("horizontal");
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState("");
  const [allPlaced, setAllPlaced] = useState(false);

  const currentShip = SHIPS[currentShipIndex];

  function toggleOrientation() {
    setOrientation((prev) => (prev === "horizontal" ? "vertical" : "horizontal"));
  }

  function handleHover(x, y) {
    if (!currentShip || allPlaced) return;
    const coords = getShipCoords(x, y, currentShip.size, orientation);
    if (!coords || hasCollision(coords, placedShips)) {
      setPreview([]);
    } else {
      setPreview(coords);
    }
  }

  async function handleClick(x, y) {
    if (!currentShip || allPlaced) return;
    setError("");

    const coords = getShipCoords(x, y, currentShip.size, orientation);
    if (!coords) {
      setError("Navio não cabe nessa posição");
      return;
    }
    if (hasCollision(coords, placedShips)) {
      setError("Posição sobrepõe outro navio");
      return;
    }

    try {
      await api.post(`/matches/${matchId}/place`, {
        type: currentShip.type,
        coordinates: coords,
      });

      const placed = [...placedShips, { type: currentShip.type, coordinates: coords }];
      setPlacedShips(placed);
      setPreview([]);

      if (currentShipIndex + 1 >= SHIPS.length) {
        setAllPlaced(true);
        if (onPlaced) onPlaced();
      } else {
        setCurrentShipIndex(currentShipIndex + 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao posicionar navio");
    }
  }

  return (
    <div className={styles.placing}>
      <h2>Posicione seus navios</h2>

      {!allPlaced && currentShip && (
        <div className={styles.placingInfo}>
          <p>
            Posicionando: <strong>{currentShip.label}</strong>
          </p>
          <p>
            Orientação:{" "}
            <button className={styles.placingInfoBtn} onClick={toggleOrientation}>
              {orientation === "horizontal" ? "Horizontal ↔" : "Vertical ↕"}
            </button>
          </p>
        </div>
      )}

      {allPlaced && (
        <p>Todos os navios posicionados! Aguardando oponente terminar...</p>
      )}

      {error && <p className="error">{error}</p>}

      <div className={styles.glassPanel}>
        <PlacingBoard
          placedShips={placedShips}
          preview={preview}
          onCellClick={handleClick}
          onCellHover={handleHover}
          onCellLeave={() => setPreview([])}
        />
      </div>

      <ShipList
        placedCount={placedShips.length}
        currentIndex={currentShipIndex}
      />
    </div>
  );
}
