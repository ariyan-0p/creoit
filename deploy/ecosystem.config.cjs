/**
 * PM2 process file — keeps the site running, restarts it on a crash, and
 * brings it back after a server reboot (see `pm2 startup`).
 * The app listens only on 127.0.0.1; nginx is the public front door.
 */
// Server-only secrets (never in git): KEY=value lines in /etc/creoit/web.env, e.g. the leads hand-over key.
const fs = require("node:fs");
const secrets = {};
try {
  for (const line of fs.readFileSync("/etc/creoit/web.env", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) secrets[m[1]] = m[2];
  }
} catch {
  /* no secrets file: the site still works, leads just stay in the backup file */
}

module.exports = {
  apps: [
    {
      name: "creoit",
      cwd: "/var/www/creoit",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3000",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "700M",
      env: {
        NODE_ENV: "production",
        NEXT_TELEMETRY_DISABLED: "1",
        ...secrets,
      },
    },
  ],
};
