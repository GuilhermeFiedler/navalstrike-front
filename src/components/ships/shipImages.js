import carrier from "../../assets/carrier.png";
import battleship from "../../assets/battleship.png";
import cruiser from "../../assets/cruiser.png";
import submarine from "../../assets/submarine.png";
import destroyer from "../../assets/destroyer.png";
import { SHIP_TYPES } from "../../constants";

export const DEFAULT_IMAGES = {
  CARRIER: carrier,
  BATTLESHIP: battleship,
  CRUISER: cruiser,
  SUBMARINE: submarine,
  DESTROYER: destroyer,
};

const SHIP_TYPES_LOWER = SHIP_TYPES.map((t) => t.toLowerCase());

const skinModules = import.meta.glob("../../assets/skins/**/*.png", { eager: true });

function buildSkinRegistry() {
  const registry = {};

  for (const [path, module] of Object.entries(skinModules)) {
    const parts = path.split("/");
    const slug = parts[parts.length - 2];
    const fileName = parts[parts.length - 1].replace(".png", "").toLowerCase();

    const shipType = SHIP_TYPES_LOWER.find((type) => fileName.includes(type));
    if (!shipType) continue;

    if (!registry[slug]) registry[slug] = {};
    registry[slug][shipType.toUpperCase()] = module.default;
  }

  return registry;
}

const SKIN_REGISTRY = buildSkinRegistry();

export { SKIN_REGISTRY };

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
