import styles from "../board/Board.module.css";
import { SHIP_IMAGES, getShipOrientation, getShipOrigin } from "./shipImages";

const CELL_SIZE = 36;

const SHIP_SCALE = {
  DESTROYER: 1.4,
  SUBMARINE: 1.25,
};

function getShipStyle(ship) {
  const orientation = getShipOrientation(ship.coordinates);
  const origin = getShipOrigin(ship.coordinates);
  const length = ship.coordinates.length;
  const scale = SHIP_SCALE[ship.shipType] || 1;

  const width = length * CELL_SIZE;
  const height = CELL_SIZE * scale;
  const offset = (height - CELL_SIZE) / 2;

  if (orientation === "horizontal") {
    const left = (origin.x + 1) * CELL_SIZE;
    const top = (origin.y + 1) * CELL_SIZE - offset;
    return { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` };
  }

  const left = (origin.x + 1) * CELL_SIZE - offset;
  const top = (origin.y + 1) * CELL_SIZE + offset;

  return {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    transformOrigin: "top left",
    transform: `rotate(90deg) translateY(-100%)`,
  };
}

export default function ShipOverlay({ ships, sunk = false }) {
  if (!ships || ships.length === 0) return null;

  return ships.map((ship) => {
    const image = SHIP_IMAGES[ship.shipType];
    if (!image) return null;

    return (
      <img
        key={ship.id || ship.shipType}
        src={image}
        alt={ship.shipType}
        className={sunk ? styles.shipImageSunk : styles.shipImage}
        style={getShipStyle(ship)}
        draggable={false}
      />
    );
  });
}
