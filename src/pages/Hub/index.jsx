import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import api from "../../utils/api";

export default function Hub() {
  const { user, logout } = useAuth();
  const [matches, setMatches] = useState([]);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMatches();
  }, []);

  async function fetchMatches() {
    try {
      const res = await api.get("/matches");
      setMatches(res.data);
    } catch {
      setMatches([]);
    }
  }

  async function handleCreate() {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/matches");
      const { matchId } = res.data;
      navigate(`/match/${matchId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao criar partida");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinByCode(e) {
    e.preventDefault();
    setError("");
    if (code.length !== 6) {
      setError("O código deve ter 6 caracteres");
      return;
    }
    try {
      const res = await api.post("/matches/join-by-code", { code: code.toUpperCase() });
      navigate(`/match/${res.data.matchId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Código inválido ou partida indisponível");
    }
  }

  async function handleJoin(matchId) {
    setError("");
    try {
      await api.post(`/matches/${matchId}/join`);
      navigate(`/match/${matchId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Não foi possível entrar na partida");
    }
  }

  return (
    <div className="hub-page">
      <header className="hub-header">
        <h1>Naval Strike</h1>
        <div>
          <span>{user.name}</span>
          <button onClick={logout}>Sair</button>
        </div>
      </header>

      <main className="hub-content">
        {error && <p className="error">{error}</p>}

        <section>
          <button onClick={handleCreate} disabled={loading}>
            {loading ? "Criando..." : "Criar Partida"}
          </button>
        </section>

        <section>
          <h2>Entrar por código</h2>
          <form onSubmit={handleJoinByCode}>
            <input
              type="text"
              maxLength={6}
              placeholder="Ex: A3X9K2"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
            />
            <button type="submit">Entrar</button>
          </form>
        </section>

        <section>
          <h2>Partidas disponíveis</h2>
          <button onClick={fetchMatches} type="button">Atualizar</button>

          {matches.length === 0 ? (
            <p>Nenhuma partida disponível no momento.</p>
          ) : (
            <ul className="match-list">
              {matches.map((match) => (
                <li key={match.id}>
                  <span>{match.hostName}</span>
                  <span>{match.code}</span>
                  <span>{new Date(match.createdAt).toLocaleTimeString()}</span>
                  <button onClick={() => handleJoin(match.id)}>Entrar</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
