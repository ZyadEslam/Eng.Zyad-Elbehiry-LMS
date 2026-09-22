// Loads .env (if present) and defaults DIRECT_URL to DATABASE_URL, then runs the given command.
const fs = require("fs"), path = require("path"), { spawnSync } = require("child_process");
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}
if (!process.env.DIRECT_URL && process.env.DATABASE_URL) process.env.DIRECT_URL = process.env.DATABASE_URL;
if (!process.env.DATABASE_URL) { console.error("✖ DATABASE_URL is not set (create .env from .env.example)"); process.exit(1); }
const [cmd, ...args] = process.argv.slice(2);
const r = spawnSync(cmd, args, { stdio: "inherit", shell: process.platform === "win32", env: process.env });
process.exit(r.status ?? 1);
