# portfolio-ssh

Pablo Vallejo's portfolio, served over SSH. Built with **Node.js**, **React Ink**
and **TypeScript**.

```
$ ssh terminal.dfbubbles.com
```

No password. No keys. Just connect.

## Stack

- **`ssh2`** — pure-JS SSH server, accepts `none` auth so the portfolio is
  publicly reachable.
- **React Ink 5** — declarative React renderer for the terminal UI.
- **TypeScript** (ESM) + **pnpm** for the dev workflow.
- **Docker** (multi-stage Alpine image) for production.

## Local development

Requires Node 20+ and pnpm.

```bash
pnpm install
pnpm dev               # tsx watch on src/server.ts
ssh -p 2222 guest@localhost
```

Available scripts:

| Script             | Description                            |
| ------------------ | -------------------------------------- |
| `pnpm dev`         | hot-reloading dev server (port 2222)   |
| `pnpm build`       | compile TS → JS into `dist/`           |
| `pnpm start`       | run the compiled server                |
| `pnpm typecheck`   | `tsc --noEmit` (no JS output)          |

## Production deployment with Docker

```bash
cp .env.example .env   # tweak SSH_PORT if needed
docker compose up -d --build
```

That brings up the SSH server, persists the host key in a named volume, and
publishes the service on the host port from `.env` (defaults to **22** so
visitors can connect with just `ssh <your-domain>`).

### Putting it on port 22

For the cleanest UX (`ssh portfolio.dfbubbles.com`) you need port 22 free on
the public IP. Two common setups:

1. **Dedicated host / IP.** The simplest — bind to 22 directly, no conflict.
2. **Shared with the host's admin sshd.** Move admin SSH to a different port
   first, e.g. edit `/etc/ssh/sshd_config`:

   ```
   Port 22022
   ```

   Restart sshd, reconnect on the new port, then bring up the container with
   `SSH_PORT=22`.

If 22 is unavailable, set `SSH_PORT=2222` and tell people to use
`ssh -p 2222 <domain>`.

### Operational tunables

The container respects the following environment variables (all optional, all
have sensible defaults set in the Dockerfile):

| Variable          | Default                          | Purpose                                         |
| ----------------- | -------------------------------- | ----------------------------------------------- |
| `PORT`            | `2222`                           | Port the server listens on _inside_ the container. |
| `HOST`            | `0.0.0.0`                        | Interface to bind.                              |
| `HOST_KEY_PATH`   | `/data/keys/host_ed25519`        | Where the persistent SSH host key lives.        |
| `MAX_CONNECTIONS` | `50`                             | Concurrent SSH sessions before refusing new ones. |
| `IDLE_TIMEOUT_MS` | `900000` (15 min)                | Kick idle visitors after this many ms.          |

### Updating

```bash
git pull
docker compose up -d --build
```

The named volume `portfolio-ssh-keys` keeps the host key across rebuilds, so
clients don't see a "host key changed" warning after each deploy.

## Architecture

```
┌────────┐  TCP/22  ┌─────────────────────────────────────────────┐
│ client │ ───────▶ │ ssh2 server (none-auth)                     │
└────────┘          │  ├─ session: pty + window-change            │
                    │  ├─ shell: PTY-like Duplex wrapper           │
                    │  └─ render(<App />, { stdin, stdout })       │
                    │       ├─ Header / Menu / Footer              │
                    │       └─ Section: About / Experience / ...   │
                    └─────────────────────────────────────────────┘
```

The trickiest part is plumbing the SSH `Channel` into Ink. Ink's `render`
expects TTY-like `stdin`/`stdout`, with `isTTY`, `setRawMode`, `columns`,
`rows`, and a `resize` event. `src/ssh/ptyStream.ts` wraps the channel and
also translates `\n` → `\r\n` on write (a real PTY does this through the
ONLCR flag; ssh2 channels don't).

Window resizes flow `client → session.window-change → ptyStream.resize →
stdout.emit('resize')`, which both Ink and the `App` component listen to.

## Customising

- **Resume data**: `src/app/resume.ts`
- **Banner style** (font, colour, padding, border): `src/app/bannerStyle.ts`
- **Colours / theme**: `src/app/theme.ts`
- **Project metadata** (this repo / web portfolio links): `src/app/project.ts`

## License

[MIT](LICENSE). Fork it and make it your own.
