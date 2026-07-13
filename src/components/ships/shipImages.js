import carrier from "../../assets/carrier.png";
import battleship from "../../assets/battleship.png";
import cruiser from "../../assets/cruiser.png";
import submarine from "../../assets/submarine.png";
import destroyer from "../../assets/destroyer.png";

export const SHIP_IMAGES = {
  CARRIER: carrier,
  BATTLESHIP: battleship,
  CRUISER: cruiser,
  SUBMARINE: submarine,
  DESTROYER: destroyer,
};

export function getShipOrientation(coordinates) {
  if (!coordinates || coordinates.length < 2) return "horizontal";
  const allSameY = coordinates.every((c) => c.y === coordinates[0].y);
  return allSameY ? "horizontal" : "vertical";
}

export function getShipOrigin(coordinates) {
  if (!coordinates || coordinates.length === 0) return { x: 0, y: 0 };
  const minX = Math.min(...coordinates.map((c) => c.x));
  const minY = Math.min(...coordinates.map((c) => c.y));
  return { x: minX, y: minY };
}
