import { EventEmitter } from "node:events";
import type { ServerChannel } from "ssh2";

export interface TtyDimensions {
  cols: number;
  rows: number;
}

interface TtyStreamLike extends EventEmitter {
  isTTY: true;
  setRawMode(_value: boolean): TtyStreamLike;
  isRaw: boolean;
  columns: number;
  rows: number;
}

export interface SshStdin extends TtyStreamLike {
  read(size?: number): unknown;
  resume(): SshStdin;
  pause(): SshStdin;
  ref(): void;
  unref(): void;
}

export interface SshStdout extends TtyStreamLike {
  write(chunk: string | Uint8Array): boolean;
  end(): void;
}

export interface PtyStream {
  stdin: SshStdin;
  stdout: SshStdout;
  resize(_dims: TtyDimensions): void;
}

const ensureNoop = (target: object, methods: string[]): void => {
  for (const m of methods) {
    const obj = target as unknown as Record<string, unknown>;
    if (typeof obj[m] !== "function") {
      obj[m] = function noop() { return this; };
    }
  }
};

const decorate = (base: EventEmitter, dims: { cols: number; rows: number }): TtyStreamLike => {
  const o = base as unknown as TtyStreamLike;
  o.isTTY = true;
  o.isRaw = false;
  o.setRawMode = function setRawMode(value: boolean) {
    this.isRaw = value;
    return this;
  };
  ensureNoop(o, ["ref", "unref"]);
  Object.defineProperty(o, "columns", { configurable: true, enumerable: true, get: () => dims.cols });
  Object.defineProperty(o, "rows",    { configurable: true, enumerable: true, get: () => dims.rows });
  return o;
};

export const createPtyStream = (channel: ServerChannel, initial: TtyDimensions): PtyStream => {
  const dims = { cols: initial.cols, rows: initial.rows };

  const stdin = decorate(channel, dims) as unknown as SshStdin;

  const stdout = decorate(new EventEmitter(), dims) as unknown as SshStdout;

  stdout.write = (chunk: string | Uint8Array): boolean => {
    const buf = typeof chunk === "string" ? Buffer.from(chunk) : Buffer.from(chunk);
    const out: number[] = [];
    let prev = 0;
    for (let i = 0; i < buf.length; i++) {
      const byte = buf[i] as number;
      if (byte === 0x0a && prev !== 0x0d) {
        out.push(0x0d, 0x0a);
      } else {
        out.push(byte);
      }
      prev = byte;
    }
    return channel.write(Buffer.from(out));
  };

  stdout.end = () => channel.end();

  channel.on("close", () => stdout.emit("close"));
  channel.on("error", (err: Error) => stdout.emit("error", err));

  return {
    stdin,
    stdout,
    resize: (next) => {
      dims.cols = next.cols;
      dims.rows = next.rows;
      stdin.emit("resize");
      stdout.emit("resize");
    },
  };
};
