const COL_HEADERS = "ABCDEFGHIJ".split("");
const SIZE = 10;

export default function PlacingBoard({ placedShips, preview, onCellClick, onCellHover, onCellLeave }) {
  function getCellClass(x, y) {
    const isPlaced = placedShips.some((ship) =>
      ship.coordinates.some((c) => c.x === x && c.y === y)
    );
    if (isPlaced) return "board-cell board-cell--ship";

    const isPreview = preview.some((c) => c.x === x && c.y === y);
    if (isPreview) return "board-cell board-cell--preview";

    return "board-cell";
  }

  return (
    <div className="board">
      <div className="board-row">
        <div className="board-cell board-cell--header"></div>
        {COL_HEADERS.map((letter, i) => (
          <div key={i} className="board-cell board-cell--header">{letter}</div>
        ))}
      </div>
      {Array.from({ length: SIZE }, (_, y) => (
        <div key={y} className="board-row">
          <div className="board-cell board-cell--header">{y + 1}</div>
          {Array.from({ length: SIZE }, (_, x) => (
            <div
              key={`${x}-${y}`}
              className={getCellClass(x, y)}
              onClick={() => onCellClick(x, y)}
              onMouseEnter={() => onCellHover(x, y)}
              onMouseLeave={onCellLeave}
              role="button"
              aria-label={`${COL_HEADERS[x]}${y + 1}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
