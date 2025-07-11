import { afterAll, beforeAll, expect, test } from "vitest";
import util from "../src/api/projects.ts";
import { startTestServer, stopTestServer } from "./server-management.ts";

beforeAll(startTestServer);

afterAll(stopTestServer);

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// USERS
// GETs

/**
 * getProjects
 */
test("Test getProjects, local. 1: Test status. 2: Test data.", async () => {
  const result = await util.getProjects();
  console.log(result);
  expect(result.status).toBe(200);
  expect(result.data).toBeDefined();
});

/**
 * getByID
 */
test("Test getByID, local. 1: Test status. 2: Test data.", async () => {
  const result = await util.getByID(1);
  console.log(result);
  expect(result.status).toBe(200);
  expect(result.data).toBeDefined();
});

/**
 * getPics
 */
test("Test getPics, local. 1: Test status. 2: Test data.", async () => {
  const result = await util.getPics(1);
  console.log(result);
  expect(result.status).toBe(200);
  expect(result.data).toBeDefined();
});

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// POSTs

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// PUTs

//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// DELETEs
