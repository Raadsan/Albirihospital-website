import "dotenv/config";
import { app } from "./app.js";
import { prisma } from "./db.js";

const port = Number(process.env.PORT || 5000);
const host = process.env.HOST || "127.0.0.1";
const server = app.listen(port, host, () => {
  console.log(`Backend running at http://${host}:${port}`);
});

server.on("error", (error) => {
  console.error(`Server failed to start: ${error.message}`);
  process.exitCode = 1;
});

function shutdown() {
  const timeout = setTimeout(() => process.exit(1), 10000);
  timeout.unref();
  server.close(async () => {
    await prisma.$disconnect();
    clearTimeout(timeout);
  });
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
