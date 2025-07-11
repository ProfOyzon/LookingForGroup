import { afterAll, beforeAll, expect, test } from "vitest";
import http from "http";
import app from "@looking-for-group/server";
import util from "../src/api/index.js";

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

/*
 * Test basic gets
 */
test("local: Test gets users", async () => {
  const apiURL = `http://localhost:${port}/users`;
  const result = await util.GET(apiURL);
  expect(result.status).toBe(200);
});

test("remote: Test gets users", async () => {
  const apiURL = `https://lfg.gccis.rit.edu/api/api/users`;
  const result = await util.GET(apiURL);
  //console.log(result);
  expect(result.status).toBe(200);
})

test("local: Test gets projects", async () => {
  const apiURL = `http://localhost:${port}/projects`;
  const result = await util.GET(apiURL);
  expect(result.status).toBe(200);
});
