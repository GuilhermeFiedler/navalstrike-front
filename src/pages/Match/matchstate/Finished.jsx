import styles from "../Match.module.css";
import { GiAnchor, GiSkullCrossedBones } from "react-icons/gi";

export default function Finished({ winnerId, userId, forfeitedBy }) {
  const won = winnerId === userId;
  const opponentForfeited = forfeitedBy && forfeitedBy !== userId;

  return (
    <div className={styles.finished}>
      <h2>{won ? <><GiAnchor /> VITÓRIA!</> : <><GiSkullCrossedBones /> DERROTA</>}</h2>
      <p>
        {opponentForfeited
          ? "O oponente abandonou a partida."
          : forfeitedBy === userId
          ? "Você abandonou a partida."
          : won
          ? "Todos os navios inimigos foram afundados!"
          : "Seus navios foram todos afundados."}
      </p>
    </div>
  );
}
