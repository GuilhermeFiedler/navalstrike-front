import styles from "../../../components/board/Board.module.css";

const COL_HEADERS = "ABCDEFGHIJ".split("");
const SIZE = 10;

export default function PlacingBoard({ placedShips, preview, onCellClick, onCellHover, onCellLeave }) {
  function getCellClass(x, y) {
    const isPlaced = placedShips.some((ship) =>
      ship.coordinates.some((c) => c.x === x && c.y === y)
    );
    if (isPlaced) return `${styles.cell} ${styles.ship}`;

    const isPreview = preview.some((c) => c.x === x && c.y === y);
    if (isPreview) return `${styles.cell} ${styles.preview}`;

    return styles.cell;
  }

  return (
    <div className={styles.board}>
      <div className={styles.row}>
        <div className={`${styles.cell} ${styles.header}`}></div>
        {COL_HEADERS.map((letter, i) => (
          <div key={i} className={`${styles.cell} ${styles.header}`}>{letter}</div>
        ))}
      </div>
      {Array.from({ length: SIZE }, (_, y) => (
        <div key={y} className={styles.row}>
          <div className={`${styles.cell} ${styles.header}`}>{y + 1}</div>
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
