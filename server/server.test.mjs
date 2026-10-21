import test from "node:test";
import assert from "node:assert/strict";
import { createAppServer } from "./server.mjs";

let server;
let baseUrl;

test.before(async () => {
  server = createAppServer();
  await new Promise((resolve) => server.listen(0, resolve));
  baseUrl = `http://localhost:${server.address().port}`;
});

test.after(() => server.close());

test("accepts the documented demo credentials", async () => {
  const response = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "demo@example.com", password: "DemoPass1" }),
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { message: "Login successful" });
});

test("rejects invalid credentials without revealing which field failed", async () => {
  const response = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: "demo@example.com", password: "wrong-password" }),
  });

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { error: "Invalid email or password" });
});

test("rejects malformed JSON", async () => {
  const response = await fetch(`${baseUrl}/api/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{not-json",
  });

  assert.equal(response.status, 400);
});
