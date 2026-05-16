import type { Connection, ServerChannel, Session } from "ssh2";
import React from "react";
import { render } from "ink";
import { App } from "../app/App.js";
import { createPtyStream } from "./ptyStream.js";

interface PtyInfo {
  cols: number;
  rows: number;
}

export interface SessionOptions {
  idleTimeoutMs?: number;
}

export const handleConnection = (
  client: Connection,
  remote: string,
  options: SessionOptions = {},
): void => {
  const idleTimeoutMs = options.idleTimeoutMs ?? 0;
  let username = "guest";

  client.on("authentication", (ctx) => {
    username = ctx.username || "guest";
    if (ctx.method === "none") {
      ctx.accept();
    } else {
      ctx.reject(["none"], true);
    }
  });

  client.on("ready", () => {
    client.on("session", (acceptSession) => {
      const session: Session = acceptSession();
      let dims: PtyInfo = { cols: 80, rows: 24 };
      let resizeStream: ((d: PtyInfo) => void) | null = null;

      session.on("pty", (accept, _reject, info) => {
        dims = { cols: info.cols, rows: info.rows };
        accept?.();
      });

      session.on("window-change", (accept, _reject, info) => {
        dims = { cols: info.cols, rows: info.rows };
        resizeStream?.(dims);
        accept?.();
      });

      session.on("exec",      (_accept, reject) => reject?.());
      session.on("subsystem", (_accept, reject) => reject?.());

      session.on("shell", (acceptShell) => {
        const channel: ServerChannel = acceptShell();
        const pty = createPtyStream(channel, dims);
        resizeStream = pty.resize;

        let idleTimer: NodeJS.Timeout | null = null;
        const armIdleTimer = () => {
          if (idleTimeoutMs <= 0) return;
          if (idleTimer) clearTimeout(idleTimer);
          idleTimer = setTimeout(() => {
            try {
              channel.write(
                `\r\n\r\n  Disconnected after ${Math.round(idleTimeoutMs / 60000)} minutes of inactivity. Reconnect anytime.\r\n`,
              );
            } catch { /* ignore */ }
            cleanup();
          }, idleTimeoutMs);
        };

        let exited = false;
        const cleanup = () => {
          if (exited) return;
          exited = true;
          if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
          try { instance.unmount(); } catch { /* ignore */ }
          try { channel.exit(0); }  catch { /* ignore */ }
          try { channel.end(); }    catch { /* ignore */ }
        };

        const instance = render(
          React.createElement(App, { username, onExit: cleanup }),
          {
            stdin:        pty.stdin  as unknown as NodeJS.ReadStream,
            stdout:       pty.stdout as unknown as NodeJS.WriteStream,
            stderr:       pty.stdout as unknown as NodeJS.WriteStream,
            exitOnCtrlC:  false,
            patchConsole: false,
          },
        );

        instance.waitUntilExit().then(cleanup, cleanup);

        armIdleTimer();
        channel.on("data",  armIdleTimer);
        channel.on("close", cleanup);
        channel.on("error", cleanup);
      });
    });
  });

  client.on("error", (err: Error & { level?: string }) => {
    if (err.level === "client-timeout" || err.level === "protocol") return;
    console.warn(`[ssh] ${remote} error: ${err.message}`);
  });

  client.on("end", () => { /* cleanup via shell channel */ });
};
