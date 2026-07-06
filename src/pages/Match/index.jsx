import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useMatchSocket from "../../hooks/useMatchSocket";
import api from "../../utils/api";
import Board from "../../components/Board";
import Placing from "./Placing";

export default function Match() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchMatch();
  }, [id]);

  async function fetchMatch() {
    try {
      const res = await api.get(`/matches/${id}`);
      setMatch(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao carregar partida");
    } finally {
      setLoading(false);
    }
  }


  const handleEvent = useCallback((event) => {
    switch (event.type) {
      case "PLAYER_JOINED":

        setMatch((prev) => ({ ...prev, status: "PLACING" }));
        break;

      case "GAME_STARTED":

        fetchMatch();
        break;

      case "ATTACK_RESULT": {
        const { x, y, hit, sunk, gameOver } = event.payload;
        const attackerId = event.playerId;
        const isMyAttack = attackerId === user.id;

        setMatch((prev) => {
          const updated = { ...prev };

          if (isMyAttack) {

            const board = { ...updated.opponentBoard };
            if (hit) {
              board.hits = [...(board.hits || []), { x, y }];
            } else {
              board.misses = [...(board.misses || []), { x, y }];
            }
            updated.opponentBoard = board;
            updated.currentTurn = null; 
          } else {

            const board = { ...updated.myBoard };
            if (hit) {
              board.hits = [...(board.hits || []), { x, y }];
            } else {
              board.misses = [...(board.misses || []), { x, y }];
            }
            updated.myBoard = board;
            updated.currentTurn = user.id; 
          }

          return updated;
        });
        break;
      }

      case "GAME_OVER":
        setMatch((prev) => ({
          ...prev,
          status: "FINISHED",
          winnerId: event.payload.winnerId,
        }));
        break;
    }
  }, [user?.id]);


  const { connected } = useMatchSocket(id, handleEvent);


  async function handleAttack(x, y) {
    try {
      await api.post(`/matches/${id}/attack`, { x, y });
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao atacar");
    }
  }

  if (loading) return <p>Carregando...</p>;
  if (error && !match) return <p className="error">{error}</p>;
  if (!match) return null;

  const isMyTurn = match.currentTurn === user.id;

  return (
    <div className="match-page">
      <header className="match-header">
        <button onClick={() => navigate("/hub")}>← Voltar</button>
        <span>{connected ? "Conectado" : "Desconectado"}</span>
      </header>

      {error && <p className="error">{error}</p>}

      {match.status === "WAITING" && <Waiting matchId={id} />}
      {match.status === "PLACING" && (
        <Placing matchId={id} myBoard={match.myBoard} onPlaced={fetchMatch} />
      )}
      {match.status === "ON_GOING" && (
        <OnGoing
          match={match}
          isMyTurn={isMyTurn}
          onAttack={handleAttack}
        />
      )}
      {match.status === "FINISHED" && (
        <Finished winnerId={match.winnerId} userId={user.id} />
      )}
    </div>
  );
}

function Waiting({ matchId }) {
  const [code, setCode] = useState("");

  useEffect(() => {
    setCode(matchId);
  }, [matchId]);

  return (
    <div className="phase-waiting">
      <h2>Aguardando oponente...</h2>
      <p>Compartilhe o código da sala com seu amigo:</p>
      <div className="code-display">
        <strong>{code}</strong>
      </div>
      <p>O jogo começará automaticamente quando alguém entrar.</p>
    </div>
  );
}

function OnGoing({ match, isMyTurn, onAttack }) {
  return (
    <div className="phase-ongoing">
      <h2>{isMyTurn ? "Sua vez! Ataque!" : "Vez do oponente..."}</h2>

      <div className="boards">
        <div>
          <h3>Seu tabuleiro</h3>
          <Board board={match.myBoard} showShips={true} disabled={true} />
        </div>
        <div>
          <h3>Tabuleiro inimigo</h3>
          <Board
            board={match.opponentBoard}
            showShips={false}
            onCellClick={isMyTurn ? onAttack : undefined}
            disabled={!isMyTurn}
          />
        </div>
      </div>
    </div>
  );
}

function Finished({ winnerId, userId }) {
  const won = winnerId === userId;

  return (
    <div className="phase-finished">
      <h2>{won ? "Venceu!" : "Perdeu!"}</h2>
      <p>{won ? "Parabéns, todos os navios inimigos foram afundados!" : "Seus navios foram todos afundados."}</p>
    </div>
  );
}
