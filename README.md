# Naval Strike

Jogo multiplayer de batalha naval em tempo real, com estética pixel art retrô inspirada em arcades 8-bit.

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-8-purple)
![WebSocket](https://img.shields.io/badge/WebSocket-STOMP-green)

## Visão Geral

Naval Strike é um jogo de batalha naval online onde dois jogadores se enfrentam em turnos. O frontend se comunica com um backend Java/Spring Boot via REST + WebSocket STOMP para partidas em tempo real.

### Funcionalidades

- Registro e login com autenticação via cookie httpOnly
- Criação e listagem de partidas (lobby)
- Entrada por código de sala (6 caracteres)
- Posicionamento de navios com drag visual
- Combate em turnos com feedback sonoro e animações
- Sistema de skins (pacotes visuais para navios)
- Histórico de partidas (Logbook)
- Reconexão automática (10s de timeout)
- Forfeit automático por desconexão

---

## Stack

| Tecnologia | Versão | Justificativa |
|------------|--------|---------------|
| **React** | 19 | Biblioteca de UI declarativa. Hooks + Context cobrem toda a gestão de estado sem necessidade de libs externas (Redux, Zustand). |
| **Vite** | 8 | Build tool extremamente rápido (ESBuild + Rollup). HMR instantâneo, glob imports nativos, hashing de assets automático. |
| **React Router** | 7 | Roteamento client-side com rotas protegidas. Padrão de mercado para SPAs React. |
| **Axios** | 1.18 | Cliente HTTP com interceptors, `withCredentials` nativo, e tratamento de erros uniforme. |
| **STOMP.js + SockJS** | 7.3 / 1.6 | WebSocket com fallback. STOMP fornece pub/sub sobre WebSocket, compatível com Spring Boot. |
| **React Icons** | 5.7 | Ícones SVG como componentes. Apenas os ícones usados entram no bundle (tree-shakeable). |
| **Vitest** | 4.1 | Test runner nativo do ecossistema Vite. Mesma config, mesmo transform pipeline. |
| **CSS Modules** | (nativo) | Escopo local de estilos sem runtime. Zero dependência extra, suportado nativamente pelo Vite. |

---

## Arquitetura

```
src/
├── assets/            # Imagens estáticas (navios, spritesheets, skins)
├── components/        # Componentes reutilizáveis (NavalCard, OceanBackground, Board, Modal...)
├── constants/         # Constantes centralizadas (ships, events, game status)
├── contexts/          # React Context (AuthProvider)
├── hooks/             # Custom hooks (useMatches, useMatchSocket, useSkins, useSoundFX...)
├── pages/             # Páginas/rotas (Hub, Match, Dock, Logbook, Login, Register)
├── styles/            # Estilos globais
├── tests/             # Testes unitários
└── utils/             # Utilitários (api client, ProtectedRoute)
```

### Decisões arquiteturais

- **Pages encapsulam features** — cada página tem seus componentes, estilos e lógica internos.
- **Hooks para lógica de negócio** — assíncrono, WebSocket e side effects em hooks dedicados.
- **Constantes centralizadas** — enums do backend (ships, events, status) em `src/constants/`.
- **Skins por convenção** — banco armazena o slug, frontend resolve via `import.meta.glob` + matching por nome de arquivo.
- **Auth stateless** — cookie httpOnly gerenciado pelo browser. Token exposto só para WebSocket cross-site.
- **WebSocket STOMP** — pub/sub por tópico de partida, eventos tipados, reconexão gerenciada por hook.

---

## Rodando localmente

### Pré-requisitos

- Node.js 18+
- Backend rodando em `http://localhost:8080` (ver repo do backend)

### Instalação

```bash
git clone https://github.com/seu-usuario/navalstrike-front.git
cd navalstrike-front
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173`

### Build

```bash
npm run build
npm run preview
```

### Testes

```bash
npm test          # watch mode
npm run test:run  # single run
```

---

## Variáveis de ambiente

| Variável | Default | Descrição |
|----------|---------|-----------|
| `VITE_API_URL` | `http://localhost:8080` | URL base do backend |

---

## Estrutura de páginas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/login` | Login | Autenticação |
| `/register` | Register | Cadastro |
| `/hub` | Hub | Lobby — criar/entrar em partidas |
| `/dock` | Dock | Gerenciar skins equipadas |
| `/logbook` | Logbook | Histórico de partidas |
| `/match/:id` | Match | Partida em tempo real |

---

## Comunicação com Backend

- **REST** (Axios) — CRUD de partidas, auth, skins
- **WebSocket STOMP** (SockJS) — Eventos em tempo real durante a partida

---

## Deploy

O projeto está configurado para deploy na Vercel: [Navalstrike](https://navalstrike-nu.vercel.app)

---

## Licença

Projeto pessoal.