import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Login from '../pages/Login'
import AuthContext from '../contexts/AuthContext'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

vi.mock('../components/OceanShader', () => ({
  default: () => <div data-testid="ocean-shader" />,
}))

function renderLogin(authValue = {}) {
  const defaultAuth = {
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    user: null,
    isAuthenticated: false,
    loading: false,
    ...authValue,
  }

  return {
    ...render(
      <AuthContext.Provider value={defaultAuth}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </AuthContext.Provider>
    ),
    authValue: defaultAuth,
  }
}

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza o formulário de login corretamente', () => {
    renderLogin()

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /ingressar/i })).toBeInTheDocument()
  })

  it('preenche os campos de email e senha', () => {
    renderLogin()

    const emailInput = screen.getByLabelText(/e-mail/i)
    const passwordInput = screen.getByLabelText(/senha/i)

    fireEvent.change(emailInput, { target: { value: 'test@email.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })

    expect(emailInput).toHaveValue('test@email.com')
    expect(passwordInput).toHaveValue('123456')
  })

  it('chama login e navega para /hub ao submeter com sucesso', async () => {
    const loginMock = vi.fn().mockResolvedValue({})
    const { authValue } = renderLogin({ login: loginMock })

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'senha123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /ingressar/i }))

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith('user@test.com', 'senha123')
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/hub')
    })
  })

  it('exibe mensagem de erro quando login falha', async () => {
    const loginMock = vi.fn().mockRejectedValue({
      response: { data: { message: 'Credenciais inválidas' } },
    })
    renderLogin({ login: loginMock })

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: 'senhaerrada' },
    })
    fireEvent.click(screen.getByRole('button', { name: /ingressar/i }))

    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument()
    })
  })

  it('mostra texto "Conectando..." no botão durante loading', async () => {
    const loginMock = vi.fn(() => new Promise(() => {})) // never resolves
    renderLogin({ login: loginMock })

    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/senha/i), {
      target: { value: '123456' },
    })
    fireEvent.click(screen.getByRole('button', { name: /ingressar/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /conectando/i })).toBeDisabled()
    })
  })

  it('tem link para a página de cadastro', () => {
    renderLogin()
    expect(screen.getByText(/cadastre-se/i)).toBeInTheDocument()
  })
})
