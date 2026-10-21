import { createServer } from "node:http";
import { scryptSync, timingSafeEqual } from "node:crypto";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(fileURLToPath(new URL("../", import.meta.url)));
const port = Number(process.env.PORT ?? 3000);
const demoUser = {
  email: "demo@example.com",
  passwordHash: scryptSync("DemoPass1", "myntra-demo-salt", 64).toString("hex"),
  salt: "myntra-demo-salt",
};

export function verifyPassword(password, user) {
  const actual = scryptSync(password, user.salt, 64);
  const expected = Buffer.from(user.passwordHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 10_000) {
      throw new Error("Request body is too large");
    }
  }
  return JSON.parse(body);
}

async function serveStatic(request, response) {
  const requestPath = normalize(new URL(request.url, "http://localhost").pathname);
  const relativePath = requestPath === "/" ? "myntralogin.html" : requestPath.slice(1);
  const filePath = resolve(projectRoot, relativePath);

  if (!filePath.startsWith(`${projectRoot}\\`) && !filePath.startsWith(`${projectRoot}/`)) {
    sendJson(response, 403, { error: "Forbidden" });
    return;
  }

  try {
    const content = await readFile(filePath);
    const contentTypes = {
      ".css": "text/css; charset=utf-8",
      ".html": "text/html; charset=utf-8",
      ".js": "text/javascript; charset=utf-8",
      ".png": "image/png",
      ".webp": "image/webp",
    };
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    response.end(content);
  } catch (error) {
    if (error.code === "ENOENT") {
      sendJson(response, 404, { error: "Not found" });
      return;
    }
    throw error;
  }
}

export function createAppServer() {
  return createServer(async (request, response) => {
    try {
      if (request.method === "POST" && request.url === "/api/login") {
        const body = await readJson(request);
        const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
        const password = typeof body.password === "string" ? body.password : "";
        const valid = email === demoUser.email && verifyPassword(password, demoUser);

        if (!valid) {
          sendJson(response, 401, { error: "Invalid email or password" });
          return;
        }
        sendJson(response, 200, { message: "Login successful" });
        return;
      }

      if (request.method === "GET") {
        await serveStatic(request, response);
        return;
      }

      sendJson(response, 405, { error: "Method not allowed" });
    } catch (error) {
      if (error instanceof SyntaxError || error.message === "Request body is too large") {
        sendJson(response, 400, { error: "Invalid request" });
        return;
      }
      console.error(error);
      sendJson(response, 500, { error: "Internal server error" });
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createAppServer();
  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(`Port ${port} is already in use.`);
      console.error(`Stop the existing server or start this one on another port:`);
      console.error(`PowerShell: $env:PORT=3001; node server/server.mjs`);
      process.exitCode = 1;
      return;
    }
    throw error;
  });
  server.listen(port, () => {
    console.log(`Myntra demo server running at http://localhost:${port}`);
    console.log("Demo login: demo@example.com / DemoPass1");
  });
}
