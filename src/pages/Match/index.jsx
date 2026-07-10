import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useMatchSocket from "../../hooks/useMatchSocket";
import api from "../../utils/api";
import Board from "../../components/board/Board";
import OceanShader from "../../components/OceanShader";
import Placing from "./placing/Placing";
import styles from "./Match.module.css";

export default function Match() {
  const { id } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const matchIdRef = useRef(id);

  useEffect(() => {
    matchIdRef.current = id;
  }, [id]);

  useEffect(() => {
    setMatch(null);
    setError("");
    setLoading(true);
    api.get(`/matches/${id}`)
      .then((res) => setMatch(res.data))
      .catch((err) => setError(err.response?.data?.message || "Erro ao carregar partida"))
      .finally(() => setLoading(false));
  }, [id]);

  const SHIP_NAMES = {
    CARRIER: "Porta-aviões",
    BATTLESHIP: "Encouraçado",
    CRUISER: "Cruzador",
    SUBMARINE: "Submarino",
    DESTROYER: "Destroyer",
  };

  function showNotification(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  }

  const handleEvent = useCallback((event) => {
    switch (event.type) {
      case "_SOCKET_CONNECTED":
        api.get(`/matches/${matchIdRef.current}`)
          .then((res) => setMatch(res.data))
          .catch(() => {});
        break;

      case "PLAYER_JOINED":
        setMatch((prev) => prev ? { ...prev, status: "PLACING" } : prev);
        break;

      case "SHIPS_PLACED":
        break;

      case "GAME_STARTED":
        api.get(`/matches/${matchIdRef.current}`)
          .then((res) => setMatch(res.data))
          .catch(() => {});
        break;

      case "ATTACK_RESULT": {
        const { x, y, hit, sunk, shipType } = event.payload;
        const attackerId = event.playerId;
        const isMyAttack = attackerId === user.id;

        if (sunk) {
          const name = SHIP_NAMES[shipType] || "Navio";
          if (isMyAttack) {
            showNotification(`${name} inimigo destruído!`);
          } else {
            showNotification(`Seu ${name} foi destruído!`);
          }
        }

        setMatch((prev) => {
          if (!prev) return prev;
          const updated = { ...prev };

          if (isMyAttack) {
            const board = { ...updated.opponentBoard };
            if (hit) {
              board.hits = [...(board.hits || []), { x, y }];
            } else {
              board.misses = [...(board.misses || []), { x, y }];
            }
            updated.opponentBoard = board;
            updated.currentTurn = hit ? user.id : null;
          } else {
            const board = { ...updated.myBoard };
            if (hit) {
              board.hits = [...(board.hits || []), { x, y }];
            } else {
              board.misses = [...(board.misses || []), { x, y }];
            }
            updated.myBoard = board;
            updated.currentTurn = hit ? null : user.id;
          }

          return updated;
        });
        break;
      }

      case "GAME_OVER":
        setMatch((prev) => prev ? ({
          ...prev,
          status: "FINISHED",
          winnerId: event.payload.winnerId,
        }) : prev);
        break;

      case "PLAYER_FORFEIT":
        setMatch((prev) => prev ? ({
          ...prev,
          status: "FINISHED",
          winnerId: event.payload.winnerId,
          forfeitedBy: event.payload.quitterId,
        }) : prev);
        break;
    }
  }, [user?.id]);

  const { connected } = useMatchSocket(id, token, handleEvent);

  async function handlePlaced() {
    try {
      const res = await api.get(`/matches/${matchIdRef.current}`);
      setMatch(res.data);
    } catch {}
  }

  async function handleLeave() {
    const inProgress = match && (match.status === "PLACING" || match.status === "ON_GOING");
    if (inProgress) {
      const confirmed = window.confirm("Tem certeza? Você vai abandonar a partida e o oponente vencerá.");
      if (!confirmed) return;
      try {
        await api.post(`/matches/${id}/forfeit`);
      } catch {}
    }
    navigate("/hub");
  }

  async function handleAttack(x, y) {
    try {
      await api.post(`/matches/${id}/attack`, { x, y });
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atacar");
    }
  }

  function getLeaveLabel() {
    if (!match) return "← VOLTAR";
    if (match.status === "PLACING") return "✕ CANCELAR";
    if (match.status === "ON_GOING") return "⚐ DESISTIR";
    return "← VOLTAR";
  }

  if (loading) return <p>Carregando...</p>;
  if (error && !match) return <p className="error">{error}</p>;
  if (!match) return null;

  const isMyTurn = match.currentTurn === user.id;

  return (
    <div className={styles.page}>
      <OceanShader className={styles.shaderBg} />

      <header className={styles.header}>
        <button className={styles.headerBtn} onClick={handleLeave}>
          {getLeaveLabel()}
        </button>
        <span className={styles.headerStatus}>
          {connected ? "● Conectado" : "○ Desconectado"}
        </span>
      </header>

      {error && <p className="error">{error}</p>}
      {notification && <div className={styles.notification}>{notification}</div>}

      {match.status === "WAITING" && <Waiting code={state?.code} />}
      {match.status === "PLACING" && (
        <Placing matchId={id} myBoard={match.myBoard} onPlaced={handlePlaced} />
      )}
      {match.status === "ON_GOING" && (
        <OnGoing match={match} isMyTurn={isMyTurn} onAttack={handleAttack} />
      )}
      {match.status === "FINISHED" && (
        <Finished winnerId={match.winnerId} userId={user.id} forfeitedBy={match.forfeitedBy} />
      )}
    </div>
  );
}

function Waiting({ code }) {
  return (
    <div className={styles.waiting}>
      <h2>Aguardando oponente...</h2>
      <p>Compartilhe o código da sala:</p>
      <div className={styles.codeDisplay}>{code || "..."}</div>
      <p>O jogo começará automaticamente quando alguém entrar.</p>
    </div>
  );
}

function OnGoing({ match, isMyTurn, onAttack }) {
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
            />
          </div>
        </div>
        <div className={styles.boardSection}>
          <h3 className={styles.boardLabelOwn}>Sua Frota</h3>
          <div className={styles.glassPanel}>
            <Board board={match.myBoard} showShips={true} disabled={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Finished({ winnerId, userId, forfeitedBy }) {
  const won = winnerId === userId;
  const opponentForfeited = forfeitedBy && forfeitedBy !== userId;

  return (
    <div className={styles.finished}>
      <h2>{won ? "⚓ VITÓRIA!" : "💀 DERROTA"}</h2>
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
