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
import DisconnectOverlay from "./DisconnectOverlay";
import Modal from "../../components/Modal/Modal";
import styles from "./Match.module.css";
import { FaTimes, FaFlag, FaCircle, FaRegCircle } from "react-icons/fa";

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
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [disconnectSeconds, setDisconnectSeconds] = useState(0);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const matchIdRef = useRef(id);
  const matchStatusRef = useRef(null);
  const { playHit, playMiss, playSunk } = useSoundFX();
  const { explosions, missAnims, addExplosion, addMissAnim, removeExplosion, removeMissAnim } = useAnimations();

  useEffect(() => {
    matchIdRef.current = id;
  }, [id]);

  useEffect(() => {
    matchStatusRef.current = match?.status || null;
  }, [match?.status]);

  useEffect(() => {
    return () => {
      if (matchStatusRef.current === "WAITING") {
        api.post(`/matches/${matchIdRef.current}/forfeit`).catch(() => {});
      }
    };
  }, []);

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
      .then((res) => {
        setMatch((prev) => {
          if (prev?.status === "FINISHED") return prev;
          if (res.data.status === "FINISHED" && !res.data.winnerId) {
            return prev;
          }
          return res.data;
        });
      })
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
        setOpponentDisconnected(false);
        setMatch((prev) => prev ? ({
          ...prev,
          status: "FINISHED",
          winnerId: event.payload.winnerId,
          forfeitedBy: event.payload.quitterId,
        }) : prev);
        break;

      case "PLAYER_DISCONNECTED":
        if (event.playerId !== user.id) {
          setOpponentDisconnected(true);
          setDisconnectSeconds(event.payload.timeoutSeconds);
        }
        break;

      case "PLAYER_RECONNECTED":
        if (event.playerId !== user.id) {
          setOpponentDisconnected(false);
        }
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
    const isWaiting = match && match.status === "WAITING";

    if (inProgress) {
      setShowLeaveModal(true);
      return;
    } else if (isWaiting) {
      try {
        await api.post(`/matches/${id}/forfeit`);
      } catch {}
    }

    navigate("/hub");
  }

  async function confirmLeave() {
    setShowLeaveModal(false);
    try {
      await api.post(`/matches/${id}/forfeit`);
    } catch {}
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
    if (match.status === "WAITING") return <><FaTimes /> SAIR</>;
    if (match.status === "PLACING") return <><FaTimes /> CANCELAR</>;
    if (match.status === "ON_GOING") return <><FaFlag /> DESISTIR</>;
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
          {connected ? <><FaCircle /> Conectado</> : <><FaRegCircle /> Desconectado</>}
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
          mySkinSlug={match.mySkinSlug || null}
          opponentSkinSlug={match.opponentSkinSlug || null}
          explosions={explosions}
          missAnims={missAnims}
          onExplosionEnd={removeExplosion}
          onMissAnimEnd={removeMissAnim}
        />
      )}
      {match.status === "FINISHED" && (
        <Finished winnerId={match.winnerId} userId={user.id} forfeitedBy={match.forfeitedBy} />
      )}

      {opponentDisconnected && <DisconnectOverlay seconds={disconnectSeconds} />}

      <Modal
        open={showLeaveModal}
        title="Abandonar partida"
        onConfirm={confirmLeave}
        onCancel={() => setShowLeaveModal(false)}
        confirmLabel="Desistir"
        cancelLabel="Voltar"
        variant="danger"
      >
        <p>Tem certeza? Você vai abandonar a partida e o oponente vencerá.</p>
      </Modal>
    </div>
  );
}
