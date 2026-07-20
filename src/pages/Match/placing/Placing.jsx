import { useState, useEffect } from "react";
import api from "../../../utils/api";
import { SHIPS } from "../shipConfig";
import { getShipCoords, hasCollision } from "../../../utils/placingUtils";
import PlacingBoard from "./PlacingBoard";
import ShipList from "../ShipList";
import styles from "../Match.module.css";
import { FaUser } from "react-icons/fa";

export default function Placing({ matchId, onPlaced, myName = "Você", opponentName = "Oponente" }) {
  const [placedShips, setPlacedShips] = useState([]);
  const [currentShipIndex, setCurrentShipIndex] = useState(0);
  const [orientation, setOrientation] = useState("horizontal");
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState("");
  const [allPlaced, setAllPlaced] = useState(false);

  const currentShip = SHIPS[currentShipIndex];

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "r" || e.key === "R") {
        toggleOrientation();
      }
    }
    if (!allPlaced) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allPlaced]);

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
      <div className={styles.playerCards}>
        <div className={`${styles.playerCard} ${styles.playerCardMe}`}>
          <FaUser className={styles.playerCardIcon} />
          <span className={styles.playerCardName}>{myName}</span>
        </div>
        <span className={styles.playerVs}>VS</span>
        <div className={`${styles.playerCard} ${styles.playerCardOpponent}`}>
          <FaUser className={styles.playerCardIcon} />
          <span className={styles.playerCardName}>{opponentName}</span>
        </div>
      </div>

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
          <p className={styles.placingHint}><kbd>R</kbd> para rotacionar</p>
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
