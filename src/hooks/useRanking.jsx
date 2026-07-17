import { useState, useEffect, useCallback } from "react";
import api from "../utils/api";

const DEFAULT_PAGE_SIZE = 10;

export default function useRanking() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [sort, setSort] = useState("victories");
  const [direction, setDirection] = useState("desc");

  const fetchRanking = useCallback(async (targetPage, targetSort, targetDirection) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/ranking", {
        params: {
          page: targetPage,
          size: DEFAULT_PAGE_SIZE,
          sort: targetSort,
          direction: targetDirection,
        },
      });
      setPlayers(res.data.content);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
      setTotalElements(res.data.totalElements);
    } catch {
      setError("Erro ao carregar ranking");
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRanking(0, sort, direction);
  }, [fetchRanking, sort, direction]);

  function goToPage(newPage) {
    setPage(newPage);
    fetchRanking(newPage, sort, direction);
  }

  function changeSort(newSort) {
    if (newSort === sort) {
      setDirection((prev) => (prev === "desc" ? "asc" : "desc"));
    } else {
      setSort(newSort);
      setDirection("desc");
    }
    setPage(0);
  }

  return {
    players,
    loading,
    error,
    page,
    totalPages,
    totalElements,
    sort,
    direction,
    goToPage,
    changeSort,
    refresh: () => fetchRanking(0, sort, direction),
  };
}
