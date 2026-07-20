import styles from "./Board.module.css";
import ShipOverlay from "../ships/ShipOverlay";
import Explosion from "./Explosion";
import MissAnim from "./MissAnim";
import oceanBg from "../../assets/ocean8bits.png";

export default function Board({ board, onCellClick, showShips = false, disabled = false, skinSlug = null, explosions = [], missAnims = [], onExplosionEnd, onMissAnimEnd }) {
  const size = 10;

  function isSunkCoordinate(x, y) {
    if (!board?.ships) return false;
    return board.ships.some((ship) =>
      ship.coordinates.some((c) => c.x === x && c.y === y)
    );
  }

  function getCellState(x, y) {
    if (!board) return "empty";

    const isHit = board.hits?.some((h) => h.x === x && h.y === y);
    const isMiss = board.misses?.some((m) => m.x === x && m.y === y);

    if (isHit) {
      if (!showShips && isSunkCoordinate(x, y)) return "sunk";
      return "hit";
    }
    if (isMiss) return "miss";

    if (showShips && board.ships) {
      const hasShip = board.ships.some((ship) =>
        ship.coordinates.some((c) => c.x === x && c.y === y)
      );
      if (hasShip) return "ship";
    }

    return "empty";
  }

  function getCellClass(state) {
    const map = {
      empty: styles.cell,
      ship: `${styles.cell} ${styles.shipCell}`,
      hit: `${styles.cell} ${styles.hit}`,
      miss: `${styles.cell} ${styles.miss}`,
      sunk: `${styles.cell} ${styles.sunk}`,
    };
    return map[state] || styles.cell;
  }

  function hasExplosion(x, y) {
    return explosions.some((e) => e.x === x && e.y === y);
  }

  function hasMissAnim(x, y) {
    return missAnims.some((e) => e.x === x && e.y === y);
  }

  function handleClick(x, y) {
    if (disabled || !onCellClick) return;
    const state = getCellState(x, y);
    if (state === "hit" || state === "miss" || state === "sunk") return;
    onCellClick(x, y);
  }

  const colHeaders = "ABCDEFGHIJ".split("");
  const hasShipsToShow = board?.ships?.length > 0;

  return (
    <div className={styles.board}>
      <div
        className={styles.oceanBg}
        style={{ backgroundImage: `url(${oceanBg})` }}
      />
      <div className={styles.row}>
        <div className={`${styles.cell} ${styles.header}`}></div>
        {colHeaders.map((letter, i) => (
          <div key={i} className={`${styles.cell} ${styles.header}`}>{letter}</div>
        ))}
      </div>
      {Array.from({ length: size }, (_, y) => (
        <div key={y} className={styles.row}>
          <div className={`${styles.cell} ${styles.header}`}>{y + 1}</div>
          {Array.from({ length: size }, (_, x) => {
            const state = getCellState(x, y);
            const exploding = hasExplosion(x, y);
            const missSplash = hasMissAnim(x, y);
            const isAnimating = exploding || missSplash;
            return (
              <div
                key={`${x}-${y}`}
                className={`${getCellClass(state)}${isAnimating ? ` ${styles.animating}` : ""}`}
                onClick={() => handleClick(x, y)}
                role={onCellClick && !disabled ? "button" : undefined}
                aria-label={`${colHeaders[x]}${y + 1} - ${state}`}
                style={{ position: "relative" }}
              >
                {exploding && (
                  <Explosion onEnd={() => onExplosionEnd?.(x, y)} />
                )}
                {missSplash && (
                  <MissAnim onEnd={() => onMissAnimEnd?.(x, y)} />
                )}
              </div>
            );
          })}
        </div>
      ))}
      {hasShipsToShow && (
        <ShipOverlay ships={board.ships} sunk={!showShips} skinSlug={skinSlug} />
      )}
    </div>
  );
}
