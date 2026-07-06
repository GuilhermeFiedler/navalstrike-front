import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuth from "../../hooks/useAuth";
import Button from "../../components/button/Button";

export default function Login() {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await login(email, password);
      alert("Login bem sucedido");
      navigate("/hub");
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Erro ao fazer login.";
      setError(message);
    }
  }
  return (
    <>
  <div className={styles.page}>
    <div className={styles.loginCard}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h1>NavalStrike</h1>
        </div>

        <h2>Bem-vindo</h2>
        <p>Entre com suas credenciais para continuar</p>
      </header>

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Digite seu email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.passwordHeader}>
            <label>Senha</label>
          </div>

          <input
            type="password"
            placeholder="Digite sua senha"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
          <a href="#">Esqueceu a senha?</a>
        </div>

        <Button
          variant="loginButton"
          type="submit"
        >
          {loading ? "Entrando..." : "Continuar"}
        </Button>

        <Button
          variant="cancelButton"
          onClick={() => navigate("/hub")}
        >
          Cancelar
        </Button>
      </form>

      <footer className={styles.footer}>
        <p>
          Não possui conta? <a href="/register">Criar conta</a>
        </p>
      </footer>
    </div>
  </div>
  </>
);
}