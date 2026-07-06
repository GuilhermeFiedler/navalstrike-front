import { useNavigate } from "react-router-dom";
import Button from "../../components/button/Button";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import styles from "./Register.module.css";

export default function Register() {
  const { register, loading } = useAuth();
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== passwordConfirmation) {
      setError("As senhas não conferem");
      return;
    }
    try {
      await register(name, email, password, passwordConfirmation);
      navigate("/hub");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Erro ao cadastrar usuário";
      setError(message);
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.registerCard}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <h1>NavalStrike</h1>
          </div>

          <h2>Criar conta</h2>
          <p>Preencha os dados abaixo para começar</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Nome de usuário</label>
            <input
              type="text"
              placeholder="Digite seu nome de usuário"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Confirmar senha</label>
            <input
              type="password"
              placeholder="Confirme sua senha"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

{error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <Button variant="registerButton" type="submit">
              {loading ? "Cadastrando..." : "Cadastrar-se"}
            </Button>

            <Button variant="cancelButton" onClick={() => navigate("/hub")}>
              Cancelar
            </Button>
          </div>
        </form>

        <footer className={styles.footer}>
          <p>
            Já possui conta? <a href="/login">Entrar</a>
          </p>
        </footer>
      </div>
    </div>
  );
}
