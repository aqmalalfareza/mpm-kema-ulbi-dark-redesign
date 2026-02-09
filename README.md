# Cloudflare Workers Full-Stack Template

[![Deploy to Cloudflare][cloudflarebutton]]

A production-ready full-stack application template built with Cloudflare Workers, Durable Objects for stateful entities, React frontend, Tailwind CSS, and shadcn/ui. Features a chat application demo with users, chat boards, and real-time message handling—all powered by a single shared Durable Object for efficient global state management.

## 🚀 Key Features

- **Serverless Backend**: Hono-based API routes with automatic CORS and logging.
- **Durable Objects**: Entity-based storage (Users, Chats) using a single `GlobalDurableObject` for KV-like operations, indexing, and ACID transactions.
- **Indexed Entities**: Automatic listing, pagination, create/delete with indexes for scalable queries.
- **Modern Frontend**: React 18, Vite, TanStack Query, React Router, with shadcn/ui components (100+ primitives).
- **Theming & UI**: Tailwind CSS with custom design tokens, dark mode, animations, glassmorphism effects.
- **Type-Safe**: Full TypeScript with shared types between frontend and worker.
- **Development Workflow**: Hot reload for both frontend and worker, Bun-powered scripts.
- **Production-Ready**: Error boundaries, client error reporting, health checks, SPA asset handling.

## 🛠️ Technology Stack

| Category | Technologies |
|----------|--------------|
| **Backend** | Cloudflare Workers, Hono, Durable Objects |
| **Frontend** | React, Vite, React Router, TanStack Query |
| **UI** | Tailwind CSS, shadcn/ui, Lucide Icons, Framer Motion |
| **State** | Zustand (client), Immer |
| **Forms** | React Hook Form, Zod |
| **Utils** | clsx, Tailwind Merge, Date-fns |
| **Dev Tools** | Bun, ESLint, TypeScript, Wrangler |

## 📦 Installation

1. **Prerequisites**:
   - [Bun](https://bun.sh/) installed (`curl -fsSL https://bun.sh/install | bash`)
   - [Cloudflare CLI (Wrangler)](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (`bunx wrangler@latest init`)

2. **Clone & Install**:
   ```bash
   git clone <your-repo-url>
   cd mpm-kema-ulbi-portal-1txcpv4xqvhr4vqwfozm2
   bun install
   ```

3. **Configure Cloudflare**:
   ```bash
   bunx wrangler login
   bunx wrangler deploy --dry-run  # Validates config
   ```

## 🔄 Development

- **Start Dev Server** (Frontend + Worker proxy):
  ```bash
  bun run dev
  ```
  Opens at `http://localhost:3000`. Hot reloads both client and worker code.

- **Type Generation**:
  ```bash
  bun run cf-typegen
  ```

- **Lint**:
  ```bash
  bun run lint
  ```

- **Build for Production**:
  ```bash
  bun run build
  ```

## 📱 Usage Examples

### API Endpoints (Backend)
All routes under `/api/`:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/users` | List users (?cursor=&limit=) |
| POST | `/api/users` | Create user `{name: string}` |
| DELETE | `/api/users/:id` | Delete user |
| POST | `/api/users/deleteMany` | Bulk delete `{ids: string[]}` |
| GET | `/api/chats` | List chats |
| POST | `/api/chats` | Create chat `{title: string}` |
| GET | `/api/chats/:chatId/messages` | List messages |
| POST | `/api/chats/:chatId/messages` | Send message `{userId: string, text: string}` |

### Frontend Customization
- Replace `src/pages/HomePage.tsx` with your app.
- Use `AppLayout` for sidebar layouts.
- Extend `worker/entities.ts` and `worker/user-routes.ts` for new entities/routes.
- Shared types in `shared/`.

## ☁️ Deployment

1. **Build Assets**:
   ```bash
   bun run build
   ```

2. **Deploy to Cloudflare**:
   ```bash
   bun run deploy
   ```
   Deploys Worker + static assets (SPA mode).

3. **Custom Domain** (Optional):
   Update `wrangler.toml` or CLI:
   ```bash
   wrangler deploy --name my-app
   wrangler pages publish dist --project-name my-app
   ```

[cloudflarebutton]

**Note**: Ensure `wrangler.toml` has your account ID and secrets. Assets are served via Workers with SPA fallback.

## 🤝 Contributing

1. Fork the repo.
2. Create a feature branch (`bun run dev`).
3. Commit changes (`bun run lint`).
4. Open a PR.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.