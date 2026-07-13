import Board from "../../../components/board/Board";
import Legend from "../../../components/Legend/Legend";
import styles from "../Match.module.css";

export default function OnGoing({ match, isMyTurn, onAttack, explosions = [], missAnims = [], onExplosionEnd, onMissAnimEnd }) {
  const opponentExplosions = explosions.filter((e) => e.isMyAttack);
  const myBoardExplosions = explosions.filter((e) => !e.isMyAttack);
  const opponentMissAnims = missAnims.filter((e) => e.isMyAttack);
  const myBoardMissAnims = missAnims.filter((e) => !e.isMyAttack);

  return (
    <div className={styles.ongoing}>
      <div className={isMyTurn ? styles.turnIndicatorActive : styles.turnIndicator}>
        {isMyTurn ? "🚀 SEU TURNO" : "⏳ VEZ DO OPONENTE"}
      </div>

      <div className={styles.boards}>
        <div className={styles.boardSection}>
          <h3 className={styles.boardLabel}>Setor Alvo</h3>
          <div className={styles.glassPanel}>
            <Board
              board={match.opponentBoard}
              showShips={false}
              onCellClick={isMyTurn ? onAttack : undefined}
              disabled={!isMyTurn}
              explosions={opponentExplosions}
              missAnims={opponentMissAnims}
              onExplosionEnd={onExplosionEnd}
              onMissAnimEnd={onMissAnimEnd}
            />
          </div>
        </div>
        <div className={styles.boardSection}>
          <h3 className={styles.boardLabelOwn}>Sua Frota</h3>
          <div className={styles.boardWithLegend}>
            <div className={styles.glassPanel}>
              <Board
                board={match.myBoard}
                showShips={true}
                disabled={true}
                explosions={myBoardExplosions}
                missAnims={myBoardMissAnims}
                onExplosionEnd={onExplosionEnd}
                onMissAnimEnd={onMissAnimEnd}
              />
            </div>
            <Legend />
          </div>
        </div>
      </div>
    </div>
  );
}
