export function getShipCoords(startX, startY, shipSize, orientation) {
  const coords = [];
  for (let i = 0; i < shipSize; i++) {
    const x = orientation === "horizontal" ? startX + i : startX;
    const y = orientation === "vertical" ? startY + i : startY;
    if (x > 9 || y > 9) return null;
    coords.push({ x, y });
  }
  return coords;
}

export function hasCollision(coords, placedShips) {
  return coords.some((c) =>
    placedShips.some((ship) =>
      ship.coordinates.some((sc) => sc.x === c.x && sc.y === c.y)
    )
  );
}
