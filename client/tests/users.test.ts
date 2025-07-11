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
test('Test getUsers, local. 1: Test status. 2: Test information.', async () => {
    const result = await util.getUsers();
    console.log(result);
    expect( result.status ).toBe(200);
    expect( result.data ).toBeDefined();
});

/**
 * getUsersById
 */
test('Test getUsersById, local. 1: Test status. 2: Test information.', async () => {
  const result = await util.getUsersById(19);
  console.log(result);
  expect( result.status ).toBe(200);
  expect( result.data ).toBeDefined();
});

/**
 * userInDatabase
 */
test('Test userInDatabase, local. 1: Test status. 2: Test invalid.', async () => {
  const result = await util.userInDatabase('lfg1234@rit.edu');
  console.log(result);
  expect( result ).toBe(true);

  const bad = await util.userInDatabase('abcde1992@rit.edu');
  console.log(bad);
  expect( bad ).toBe(false);
})

/**
 * getAccountInformation
 */
test('Test getAccountInformation, local. 1: Test invalid, status, info. 2: Test valid, status, info.', async () => {
  const bad = await util.getAccountInformation(19);
  console.log(bad);
  expect( bad.error ).toBeDefined();

  const response = await util.getAccountInformation(19);
  console.log(response);
  expect( response.data ).toBeDefined();
});

/**
 * getUserByUsername
 */
test('Test getUserByUsername, local. 1: Test status. 2: Test data.', async () => {
  const response = await util.getUserByUsername('Mr. LFG');
  console.log(response);
  expect( response.data ).toBeDefined();
  expect( response.status ).toBe(200);
});

/**
 * getUserByEmail
 */
test('Test getUserByEmail, local. 1: Test status. 2: Test data.', async () => {
  const response = await util.getUserByEmail('lfg1234@rit.edu');
  console.log(response);
  expect( response.data ).toBeDefined();
  expect( response.status ).toBe(200);
});

/**
 * getUserFollowing
 */
test('Test getUserFollowing, local. 1: Test status. 2: Test data.', async () => {
  const response = await util.getUserFollowing(19);
  console.log(response);
  expect( response.data ).toBeDefined();
  expect( response.status ).toBe(200);
});

/**
 * getVisibleProjects
 */
test('Test getVisibleProjects, local. 1: Test status. 2: Test data.', async () => {
  const response = await util.getVisibleProjects(19);
  console.log(response);
  expect( response.data ).toBeDefined();
  expect( response.status ).toBe(200);
});

/**
 * getProjectFollowing
 */
test('Test getProjectFollowing, local. 1: Test status. 2: Test data', async () => {
  const response = await util.getProjectFollowing(19);
  console.log(response);
  expect( response.data ).toBeDefined();
  expect( response.status ).toBe(200);
});


//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// POSTs


//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// PUTs


//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
// DELETEs