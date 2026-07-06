export default function Board({ board, onCellClick, showShips = false, disabled = false }) {
  const size = 10;

  function getCellState(x, y) {
    if (!board) return "empty";

    const isHit = board.hits?.some((h) => h.x === x && h.y === y);
    const isMiss = board.misses?.some((m) => m.x === x && m.y === y);

    if (isHit) return "hit";
    if (isMiss) return "miss";

    if (showShips && board.ships) {
      const hasShip = board.ships.some((ship) =>
        ship.coordinates.some((c) => c.x === x && c.y === y)
      );
      if (hasShip) return "ship";
    }


    if (!showShips && board.ships) {
      const sunkShip = board.ships.some((ship) =>
        ship.coordinates.some((c) => c.x === x && c.y === y)
      );
      if (sunkShip) return "sunk";
    }

    return "empty";
  }

  function getCellClass(state) {
    const classes = {
      empty: "board-cell",
      ship: "board-cell board-cell--ship",
      hit: "board-cell board-cell--hit",
      miss: "board-cell board-cell--miss",
      sunk: "board-cell board-cell--sunk",
    };
    return classes[state] || "board-cell";
  }

  function handleClick(x, y) {
    if (disabled || !onCellClick) return;
    const state = getCellState(x, y);

    if (state === "hit" || state === "miss" || state === "sunk") return;
    onCellClick(x, y);
  }

  const colHeaders = "ABCDEFGHIJ".split("");

  return (
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
          {Array.from({ length: size }, (_, x) => {
            const state = getCellState(x, y);
            return (
              <div
                key={`${x}-${y}`}
                className={getCellClass(state)}
                onClick={() => handleClick(x, y)}
                role={onCellClick && !disabled ? "button" : undefined}
                aria-label={`${colHeaders[x]}${y + 1} - ${state}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
