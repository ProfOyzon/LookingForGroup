import { afterAll, beforeAll, expect, test } from "vitest";
import util from "../src/api/users.ts";
import { startTestServer, stopTestServer } from "./server-management.ts";

beforeAll(startTestServer);

afterAll(stopTestServer);

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// USERS
// GETs

/**
 * getUsers
 */
test("Test getUsers, local. 1: Test status. 2: Test information.", async () => {
  const result = await util.getUsers();
  console.log(result);
  expect(result.status).toBe(200);
  expect(result.data).toBeDefined();
});

/**
 * getUsersById
 */
test("Test getUsersById, local. 1: Test status. 2: Test information.", async () => {
  const result = await util.getUsersById(19);
  console.log(result);
  expect(result.status).toBe(200);
  expect(result.data).toBeDefined();
});
