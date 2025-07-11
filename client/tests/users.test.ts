import { afterAll, beforeAll, expect, test } from "vitest";
import http from "http";
import app from "@looking-for-group/server";
import util from "../src/api/users.ts";

let server: http.Server;
let port: number;

beforeAll(async () => {
  server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(0, resolve));

  port = (server.address() as { port: number }).port;
});

afterAll(async () => {
  await new Promise((resolve) => server.close(resolve));
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// USERS
// GETs

/**
 * getUsers
 */
test('Test getUsers. Local-1: Test status. Local-2: Test information.', async () => {
  const baseUrl = `http://localhost:${port}`;
  const result = await util.getUsers(baseUrl);
  console.log(result);
  expect(result.status).toBe(200);
  expect(result.data).toBeDefined();
});