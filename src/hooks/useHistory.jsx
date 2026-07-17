import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const DEFAULT_PAGE_SIZE = 5;

export default function useHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [victories, setVictories] = useState(0);
  const [defeats, setDefeats] = useState(0);

  const fetchHistory = useCallback(async (targetPage = 0) => {
    setLoading(true);
    setError("");
    try {
      const [res] = await Promise.all([
        api.get("/matches/history", {
          params: { page: targetPage, size: DEFAULT_PAGE_SIZE },
        }),
        new Promise((r) => setTimeout(r, 800)),
      ]);
      setHistory(res.data.content);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
      setVictories(res.data.totalVictories);
      setDefeats(res.data.totalDefeats);
    } catch {
      setError("Erro ao carregar histórico de partidas");
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(0);
  }, [fetchHistory]);

  function goToPage(newPage) {
    setPage(newPage);
    fetchHistory(newPage);
  }

  return {
    history,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    victories,
    defeats,
    goToPage,
    fetchHistory,
  };
}
