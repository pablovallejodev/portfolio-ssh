import ssh2 from "ssh2";
import { resolve } from "node:path";
import { loadOrCreateHostKey } from "./ssh/hostKey.js";
import { handleConnection } from "./ssh/session.js";

const { Server } = ssh2;

const PORT = Number(process.env.PORT ?? 2222);
const HOST = process.env.HOST ?? "0.0.0.0";
const HOST_KEY_PATH = resolve(process.env.HOST_KEY_PATH ?? "./keys/host_ed25519");
const MAX_CONNECTIONS = Number(process.env.MAX_CONNECTIONS ?? 50);
const IDLE_TIMEOUT_MS = Number(process.env.IDLE_TIMEOUT_MS ?? 15 * 60 * 1000);

const BANNER =
  "\r\n  Welcome to Pablo Vallejo's portfolio over SSH.\r\n" +
  "  Press 'q' or Ctrl-C at any time to exit.\r\n\r\n";

const log = (message: string): void => {
  console.log(`${new Date().toISOString()} [ssh] ${message}`);
};

const main = (): void => {
  const hostKey = loadOrCreateHostKey(HOST_KEY_PATH);
  const active = new Set<ssh2.Connection>();

  const server = new Server(
    { hostKeys: [hostKey], banner: BANNER, ident: "SSH-2.0-portfolio-ssh_1.0" },
    (client, info) => {
      const remote = `${info.ip}:${info.port}`;

      if (active.size >= MAX_CONNECTIONS) {
        log(`reject ${remote} (max ${MAX_CONNECTIONS} reached)`);
        try { client.end(); } catch { /* ignore */ }
        return;
      }

      active.add(client);
      log(`connect ${remote} (active: ${active.size}/${MAX_CONNECTIONS})`);

      const drop = () => {
        if (active.delete(client)) {
          log(`disconnect ${remote} (active: ${active.size}/${MAX_CONNECTIONS})`);
        }
      };
      client.on("end", drop);
      client.on("close", drop);

      handleConnection(client, remote, { idleTimeoutMs: IDLE_TIMEOUT_MS });
    },
  );

  server.on("error", (err: Error) => log(`server error: ${err.message}`));

  server.listen(PORT, HOST, () => {
    const addr = server.address();
    const port = typeof addr === "object" && addr ? addr.port : PORT;
    log(`listening on ${HOST}:${port} (host key: ${HOST_KEY_PATH})`);
    log(`limits: max=${MAX_CONNECTIONS} idleMs=${IDLE_TIMEOUT_MS}`);
    log(`try: ssh -p ${port} guest@localhost`);
  });

  const shutdown = (signal: string) => {
    log(`received ${signal}, shutting down (active: ${active.size})`);
    server.close();
    for (const client of active) {
      try { client.end(); } catch { /* ignore */ }
    }
    setTimeout(() => process.exit(0), 1500).unref();
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

main();
