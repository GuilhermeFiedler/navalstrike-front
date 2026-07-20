import { useState, useEffect } from "react";
import styles from "../board/Board.module.css";
import { getShipImage, getShipOrientation, getShipOrigin } from "./shipImages";

const CELL_DESKTOP = 44;
const CELL_MOBILE = 32;
const BREAKPOINT = 768;

const SHIP_SCALE = {
  DESTROYER: 1.4,
  SUBMARINE: 1.25,
};

function getCellSize() {
  return window.innerWidth <= BREAKPOINT ? CELL_MOBILE : CELL_DESKTOP;
}

function getShipStyle(ship, cellSize) {
  const orientation = getShipOrientation(ship.coordinates);
  const origin = getShipOrigin(ship.coordinates);
  const length = ship.coordinates.length;
  const scale = SHIP_SCALE[ship.shipType] || 1;

  const width = length * cellSize;
  const height = cellSize * scale;
  const offset = (height - cellSize) / 2;

  if (orientation === "horizontal") {
    const left = (origin.x + 1) * cellSize;
    const top = (origin.y + 1) * cellSize - offset;
    return { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` };
  }

  const left = (origin.x + 1) * cellSize - offset;
  const top = (origin.y + 1) * cellSize + offset;

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    transformOrigin: "top left",
    transform: `rotate(90deg) translateY(-100%)`,
  };
}

export default function ShipOverlay({ ships, sunk = false, skinSlug = null }) {
  const [cellSize, setCellSize] = useState(getCellSize);

  useEffect(() => {
    function handleResize() {
      setCellSize(getCellSize());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!ships || ships.length === 0) return null;

  return ships.map((ship) => {
    const image = getShipImage(skinSlug, ship.shipType);
    if (!image) return null;

    return (
      <img
        key={ship.id || ship.shipType}
        src={image}
        alt={ship.shipType}
        className={sunk ? styles.shipImageSunk : styles.shipImage}
        style={getShipStyle(ship, cellSize)}
        draggable={false}
      />
    );
  });
}
