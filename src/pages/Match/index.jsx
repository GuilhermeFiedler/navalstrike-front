import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useMatchSocket from "../../hooks/useMatchSocket";
import useSoundFX from "../../hooks/useSoundFX";
import useAnimations from "../../hooks/useAnimations";
import api from "../../utils/api";
import OceanShader from "../../components/OceanShader";
import Placing from "./placing/Placing";
import Waiting from "./matchstate/Waiting";
import OnGoing from "./matchstate/OnGoing";
import Finished from "./matchstate/Finished";
import styles from "./Match.module.css";

const SHIP_NAMES = {
  CARRIER: "Porta-aviões",
  BATTLESHIP: "Encouraçado",
  CRUISER: "Cruzador",
  SUBMARINE: "Submarino",
  DESTROYER: "Destroyer",
};

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
  const { playHit, playMiss, playSunk } = useSoundFX();
  const { explosions, missAnims, addExplosion, addMissAnim, removeExplosion, removeMissAnim } = useAnimations();

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

  function showNotification(msg) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  }

  function refreshMatch() {
    api.get(`/matches/${matchIdRef.current}`)
      .then((res) => setMatch(res.data))
      .catch(() => {});
  }

  const handleEvent = useCallback((event) => {
    switch (event.type) {
      case "_SOCKET_CONNECTED":
        refreshMatch();
        break;

      case "PLAYER_JOINED":
        setMatch((prev) => prev ? { ...prev, status: "PLACING" } : prev);
        break;

      case "SHIPS_PLACED":
        break;

      case "GAME_STARTED":
        refreshMatch();
        break;

      case "ATTACK_RESULT": {
        const { x, y, hit, sunk, shipType } = event.payload;
        const attackerId = event.playerId;
        const isMyAttack = attackerId === user.id;

        if (sunk) {
          playSunk();
        } else if (hit) {
          playHit();
        } else {
          playMiss();
        }

        if (hit) {
          addExplosion(x, y, isMyAttack);
        } else {
          addMissAnim(x, y, isMyAttack);
        }

        if (sunk) {
          const name = SHIP_NAMES[shipType] || "Navio";
          showNotification(isMyAttack ? `${name} inimigo destruído!` : `Seu ${name} foi destruído!`);
        }

        setMatch((prev) => {
          if (!prev) return prev;
          const updated = { ...prev };
          const boardKey = isMyAttack ? "opponentBoard" : "myBoard";
          const board = { ...updated[boardKey] };

          if (hit) {
            board.hits = [...(board.hits || []), { x, y }];
          } else {
            board.misses = [...(board.misses || []), { x, y }];
          }

          updated[boardKey] = board;
          updated.currentTurn = (hit === isMyAttack) ? user.id : null;

          return updated;
        });

        if (sunk) refreshMatch();
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
  }, [user?.id, playHit, playMiss, playSunk, addExplosion, addMissAnim]);

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
        <OnGoing
          match={match}
          isMyTurn={isMyTurn}
          onAttack={handleAttack}
          explosions={explosions}
          missAnims={missAnims}
          onExplosionEnd={removeExplosion}
          onMissAnimEnd={removeMissAnim}
        />
      )}
      {match.status === "FINISHED" && (
        <Finished winnerId={match.winnerId} userId={user.id} forfeitedBy={match.forfeitedBy} />
      )}
    </div>
  );
}
