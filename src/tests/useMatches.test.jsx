import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import useMatches from '../hooks/useMatches'
import AuthContext from '../contexts/AuthContext'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../utils/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import api from '../utils/api'

const MOCK_USER = { id: 'user-1', name: 'Comandante' }

function wrapper({ children }) {
  const authValue = {
    user: MOCK_USER,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    isAuthenticated: true,
    loading: false,
  }

  return (
    <AuthContext.Provider value={authValue}>
      <MemoryRouter>{children}</MemoryRouter>
    </AuthContext.Provider>
  )
}

describe('useMatches', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    api.get.mockResolvedValue({
      data: [
        { id: '1', hostId: 'user-2', hostName: 'Rival' },
        { id: '2', hostId: 'user-1', hostName: 'Comandante' },
        { id: '3', hostId: 'user-3', hostName: 'Outro' },
      ],
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fetchMatches filtra partidas do próprio usuário', async () => {
    const { result } = renderHook(() => useMatches(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(1500)
      await vi.runAllTimersAsync()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.matches).toHaveLength(2)
    expect(result.current.matches.every((m) => m.hostId !== 'user-1')).toBe(true)
  })

  it('fetchMatches define matches como vazio quando API falha', async () => {
    api.get.mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useMatches(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(1500)
      await vi.runAllTimersAsync()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.matches).toEqual([])
  })

  it('handleCreate navega para /match com code no state', async () => {
    api.post.mockResolvedValueOnce({
      data: { matchId: 'match-99', code: 'ABC123' },
    })

    const { result } = renderHook(() => useMatches(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    await act(async () => {
      await result.current.handleCreate()
    })

    expect(api.post).toHaveBeenCalledWith('/matches')
    expect(mockNavigate).toHaveBeenCalledWith('/match/match-99', {
      state: { code: 'ABC123' },
    })
  })

  it('handleCreate define erro quando API falha', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Limite de partidas atingido' } },
    })

    const { result } = renderHook(() => useMatches(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    await act(async () => {
      await result.current.handleCreate()
    })

    expect(result.current.error).toBe('Limite de partidas atingido')
  })

  it('handleJoinByCode navega para /match ao entrar com sucesso', async () => {
    api.post.mockResolvedValueOnce({
      data: { matchId: 'match-55' },
    })

    const { result } = renderHook(() => useMatches(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    await act(async () => {
      await result.current.handleJoinByCode('XYZ789')
    })

    expect(api.post).toHaveBeenCalledWith('/matches/join-by-code', { code: 'XYZ789' })
    expect(mockNavigate).toHaveBeenCalledWith('/match/match-55')
  })

  it('handleJoinByCode mapeia "Partida foi cancelada" para mensagem amigável', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Partida foi cancelada' } },
    })

    const { result } = renderHook(() => useMatches(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    await act(async () => {
      await result.current.handleJoinByCode('ABC123')
    })

    expect(result.current.error).toBe('Esta partida foi cancelada pelo criador')
  })

  it('handleJoinByCode mapeia "Partida já iniciada" para mensagem amigável', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Partida já iniciada' } },
    })

    const { result } = renderHook(() => useMatches(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    await act(async () => {
      await result.current.handleJoinByCode('ABC123')
    })

    expect(result.current.error).toBe('Esta partida já está em andamento')
  })

  it('handleJoinByCode mapeia "Não é possível entrar na própria partida" para mensagem amigável', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Não é possível entrar na própria partida' } },
    })

    const { result } = renderHook(() => useMatches(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    await act(async () => {
      await result.current.handleJoinByCode('ABC123')
    })

    expect(result.current.error).toBe('Você não pode entrar na sua própria partida')
  })

  it('handleJoinByCode usa fallback para erros desconhecidos', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: '' } },
    })

    const { result } = renderHook(() => useMatches(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    await act(async () => {
      await result.current.handleJoinByCode('ABC123')
    })

    expect(result.current.error).toBe('Código inválido ou partida indisponível')
  })

  it('handleJoin navega para /match ao entrar com sucesso', async () => {
    api.post.mockResolvedValueOnce({})

    const { result } = renderHook(() => useMatches(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    await act(async () => {
      await result.current.handleJoin('match-10')
    })

    expect(api.post).toHaveBeenCalledWith('/matches/match-10/join')
    expect(mockNavigate).toHaveBeenCalledWith('/match/match-10')
  })

  it('handleJoin define erro quando API falha', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Partida lotada' } },
    })

    const { result } = renderHook(() => useMatches(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    await act(async () => {
      await result.current.handleJoin('match-10')
    })

    expect(result.current.error).toBe('Partida lotada')
  })

  it('handleConnect navega para /match sem chamar API', async () => {
    const { result } = renderHook(() => useMatches(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    act(() => {
      result.current.handleConnect('match-7')
    })

    expect(mockNavigate).toHaveBeenCalledWith('/match/match-7')
    expect(api.post).not.toHaveBeenCalledWith(expect.stringContaining('match-7'))
  })

  it('erro desaparece após 5 segundos', async () => {
    api.post.mockRejectedValueOnce({
      response: { data: { message: 'Erro qualquer' } },
    })

    const { result } = renderHook(() => useMatches(), { wrapper })

    await act(async () => {
      vi.advanceTimersByTime(1500)
    })

    await act(async () => {
      await result.current.handleCreate()
    })

    expect(result.current.error).toBe('Erro qualquer')

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.error).toBe('')
  })

  it('retorna userId do usuário autenticado', async () => {
    const { result } = renderHook(() => useMatches(), { wrapper })

    expect(result.current.userId).toBe('user-1')
  })
})
