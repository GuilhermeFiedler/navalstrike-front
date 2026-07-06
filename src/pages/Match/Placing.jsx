import { useState } from "react";
import api from "../../utils/api";

const SHIPS = [
  { type: "CARRIER", size: 5, label: "Porta-aviões (5)" },
  { type: "BATTLESHIP", size: 4, label: "Encouraçado (4)" },
  { type: "CRUISER", size: 3, label: "Cruzador (3)" },
  { type: "SUBMARINE", size: 3, label: "Submarino (3)" },
  { type: "DESTROYER", size: 2, label: "Destroyer (2)" },
];

export default function Placing({ matchId, myBoard, onPlaced }) {
  const [placedShips, setPlacedShips] = useState([]);
  const [currentShipIndex, setCurrentShipIndex] = useState(0);
  const [orientation, setOrientation] = useState("horizontal"); 
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState("");
  const [allPlaced, setAllPlaced] = useState(false);

  const currentShip = SHIPS[currentShipIndex];
  const size = 10;


  function getShipCoords(startX, startY, shipSize, dir) {
    const coords = [];
    for (let i = 0; i < shipSize; i++) {
      const x = dir === "horizontal" ? startX + i : startX;
      const y = dir === "vertical" ? startY + i : startY;
      if (x > 9 || y > 9) return null;
      coords.push({ x, y });
    }
    return coords;
  }


  function hasCollision(coords) {
    return coords.some((c) =>
      placedShips.some((ship) =>
        ship.coordinates.some((sc) => sc.x === c.x && sc.y === c.y)
      )
    );
  }

  function handleHover(x, y) {
    if (!currentShip || allPlaced) return;
    const coords = getShipCoords(x, y, currentShip.size, orientation);
    if (!coords || hasCollision(coords)) {
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
    if (hasCollision(coords)) {
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

  function getCellClass(x, y) {

    const isPlaced = placedShips.some((ship) =>
      ship.coordinates.some((c) => c.x === x && c.y === y)
    );
    if (isPlaced) return "board-cell board-cell--ship";


    const isPreview = preview.some((c) => c.x === x && c.y === y);
    if (isPreview) return "board-cell board-cell--preview";

    return "board-cell";
  }

  const colHeaders = "ABCDEFGHIJ".split("");

  return (
    <div className="phase-placing">
      <h2>Posicione seus navios</h2>

      {!allPlaced && currentShip && (
        <div className="placing-info">
          <p>
            Posicionando: <strong>{currentShip.label}</strong>
          </p>
          <p>
            Orientação:{" "}
            <button onClick={() => setOrientation(orientation === "horizontal" ? "vertical" : "horizontal")}>
              {orientation === "horizontal" ? "Horizontal ↔" : "Vertical ↕"}
            </button>
          </p>
        </div>
      )}

      {allPlaced && (
        <p>Todos os navios posicionados! Aguardando oponente terminar...</p>
      )}

      {error && <p className="error">{error}</p>}

      <div className="board">
        <div className="board-row">
          <div className="board-cell board-cell--header"></div>
          {colHeaders.map((letter, i) => (
            <div key={i} className="board-cell board-cell--header">{letter}</div>
          ))}
        </div>
        {Array.from({ length: size }, (_, y) => (
          <div key={y} className="board-row">
            <div className="board-cell board-cell--header">{y + 1}</div>
            {Array.from({ length: size }, (_, x) => (
              <div
                key={`${x}-${y}`}
                className={getCellClass(x, y)}
                onClick={() => handleClick(x, y)}
                onMouseEnter={() => handleHover(x, y)}
                onMouseLeave={() => setPreview([])}
                role="button"
                aria-label={`${colHeaders[x]}${y + 1}`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="ship-list">
        <h3>Navios</h3>
        <ul>
          {SHIPS.map((ship, i) => (
            <li key={ship.type} className={i < placedShips.length ? "placed" : i === currentShipIndex ? "current" : ""}>
              {ship.label} {i < placedShips.length ? "✓" : ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
