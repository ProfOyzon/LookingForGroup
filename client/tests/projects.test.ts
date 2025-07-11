import { afterAll, beforeAll, expect, test } from "vitest";
import http from "http";
import app from "@looking-for-group/server";
import util from "../src/api/projects.ts";

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
 * getProjects
 */
test('Test getProjects, local. 1: Test status. 2: Test data.', async () => {
    const result = await util.getProjects();
    console.log(result);
    expect( result.status ).toBe(200);
    expect( result.data ).toBeDefined();
});

/**
 * getByID
 */
test('Test getByID, local. 1: Test status. 2: Test data.', async () => {
    const result = await util.getByID(1);
    console.log(result);
    expect( result.status ).toBe(200);
    expect( result.data ).toBeDefined();
});

/**
 * getPics
 */
test('Test getPics, local. 1: Test status. 2: Test data.', async () => {
    const result = await util.getPics(1);
    console.log(result);
    expect( result.status ).toBe(200);
    expect( result.data ).toBeDefined();
})

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// POSTs

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// PUTs

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// DELETEs