import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import Register from '../pages/Register'
import AuthContext from '../contexts/AuthContext'

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderRegister(authValue = {}) {
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
          <Register />
        </MemoryRouter>
      </AuthContext.Provider>
    ),
    authValue: defaultAuth,
  }
}

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza o formulário de cadastro corretamente', () => {
    renderRegister()

    expect(screen.getByLabelText(/nome de usuário/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha de segurança/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cadastrar-se/i })).toBeInTheDocument()
  })

  it('preenche todos os campos do formulário', () => {
    renderRegister()

    const nameInput = screen.getByLabelText(/nome de usuário/i)
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/senha de segurança/i)
    const confirmInput = screen.getByLabelText(/confirmar senha/i)

    fireEvent.change(nameInput, { target: { value: 'Comandante' } })
    fireEvent.change(emailInput, { target: { value: 'cmd@navy.com' } })
    fireEvent.change(passwordInput, { target: { value: 'senha123' } })
    fireEvent.change(confirmInput, { target: { value: 'senha123' } })

    expect(nameInput).toHaveValue('Comandante')
    expect(emailInput).toHaveValue('cmd@navy.com')
    expect(passwordInput).toHaveValue('senha123')
    expect(confirmInput).toHaveValue('senha123')
  })

  it('exibe erro quando as senhas não conferem', async () => {
    renderRegister()

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: 'User' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/senha de segurança/i), {
      target: { value: 'senha123' },
    })
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: 'senhadiferente' },
    })

    fireEvent.click(screen.getByRole('button', { name: /cadastrar-se/i }))

    await waitFor(() => {
      expect(screen.getByText('As senhas não conferem')).toBeInTheDocument()
    })
  })

  it('chama register e navega para /hub ao submeter com sucesso', async () => {
    const registerMock = vi.fn().mockResolvedValue({})
    renderRegister({ register: registerMock })

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: 'Comandante' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'cmd@navy.com' },
    })
    fireEvent.change(screen.getByLabelText(/senha de segurança/i), {
      target: { value: 'senha123' },
    })
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: 'senha123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /cadastrar-se/i }))

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith(
        'Comandante',
        'cmd@navy.com',
        'senha123',
        'senha123'
      )
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/hub')
    })
  })

  it('exibe mensagem de erro quando o cadastro falha', async () => {
    const registerMock = vi.fn().mockRejectedValue({
      response: { data: { message: 'Email já cadastrado' } },
    })
    renderRegister({ register: registerMock })

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: 'User' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'existe@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/senha de segurança/i), {
      target: { value: 'senha123' },
    })
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: 'senha123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /cadastrar-se/i }))

    await waitFor(() => {
      expect(screen.getByText('Email já cadastrado')).toBeInTheDocument()
    })
  })

  it('mostra texto "Cadastrando..." no botão durante loading', async () => {
    const registerMock = vi.fn(() => new Promise(() => {})) // never resolves
    renderRegister({ register: registerMock })

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: 'User' },
    })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@test.com' },
    })
    fireEvent.change(screen.getByLabelText(/senha de segurança/i), {
      target: { value: 'senha123' },
    })
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: 'senha123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /cadastrar-se/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /cadastrando/i })).toBeDisabled()
    })
  })

  it('tem link para a página de login', () => {
    renderRegister()
    expect(screen.getByText(/faça login/i)).toBeInTheDocument()
  })
})
