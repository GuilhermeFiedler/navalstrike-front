import carrier from "../../assets/carrier.png";
import battleship from "../../assets/battleship.png";
import cruiser from "../../assets/cruiser.png";
import submarine from "../../assets/submarine.png";
import destroyer from "../../assets/destroyer.png";

import animalCarrier from "../../assets/skins/animalia/animalcarrier.png";
import animalBattleship from "../../assets/skins/animalia/animalbattleship.png";
import animalCruiser from "../../assets/skins/animalia/animalcruiser.png";
import animalSubmarine from "../../assets/skins/animalia/animalsubmarine.png";
import animalDestroyer from "../../assets/skins/animalia/animaldestroyer.png";

import galaxyCarrier from "../../assets/skins/galaxy/galaxycarrier.png";
import galaxyBattleship from "../../assets/skins/galaxy/galaxybattleship.png";
import galaxyCruiser from "../../assets/skins/galaxy/galaxycruiser.png";
import galaxySubmarine from "../../assets/skins/galaxy/galaxysubmarine.png";
import galaxyDestroyer from "../../assets/skins/galaxy/galaxydestroyer.png";

export const DEFAULT_IMAGES = {
  CARRIER: carrier,
  BATTLESHIP: battleship,
  CRUISER: cruiser,
  SUBMARINE: submarine,
  DESTROYER: destroyer,
};

export const SKIN_REGISTRY = {
  animalia: {
    CARRIER: animalCarrier,
    BATTLESHIP: animalBattleship,
    CRUISER: animalCruiser,
    SUBMARINE: animalSubmarine,
    DESTROYER: animalDestroyer,
  },
  galaxy: {
    CARRIER: galaxyCarrier,
    BATTLESHIP: galaxyBattleship,
    CRUISER: galaxyCruiser,
    SUBMARINE: galaxySubmarine,
    DESTROYER: galaxyDestroyer,
  },
};

export function getShipImage(skinSlug, shipType) {
  if (!skinSlug) return DEFAULT_IMAGES[shipType];
  return SKIN_REGISTRY[skinSlug]?.[shipType] || DEFAULT_IMAGES[shipType];
}

export const SHIP_IMAGES = DEFAULT_IMAGES;

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
