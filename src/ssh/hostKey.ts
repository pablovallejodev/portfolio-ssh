import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname } from "node:path";
import ssh2 from "ssh2";

export const loadOrCreateHostKey = (path: string): Buffer => {
  if (existsSync(path)) {
    return readFileSync(path);
  }
  const { private: privateKey } = ssh2.utils.generateKeyPairSync("ed25519");
  const buffer = Buffer.from(privateKey, "utf8");
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, buffer, { mode: 0o600 });
  return buffer;
};
