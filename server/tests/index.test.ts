import { expect, test } from 'vitest';
import { GET } from '../../client/src/api/index.ts';
//import {ApiResponse} from '../../client/src/api/types.ts';

/**
 * Testing basic GETs
 */
test('lfg: Test gets users', async () => {
  const apiURL = 'https://lfg.gccis.rit.edu/api/users';
  const result = await GET(apiURL);
  expect(result.status).toBe(200);
});

test('local: Test gets users', async () => {
  const apiURL = 'http://localhost:8081/api/users';
  const result = await GET(apiURL);
  expect(result.status).toBe(200);
});

test('lfg: Test gets projects', async () => {
  const apiURL = 'https://lfg.gccis.rit.edu/api/projects';
  const result = await GET(apiURL);

  expect(result.status).toBe(200);
});

test('local: Test gets projects', async () => {
  const apiURL = 'http://localhost:8081/api/projects';
  const result = await GET(apiURL);
  expect(result.status).toBe(200);
});

/**
 * Testing basic POSTs
 */

/**
 * Testing basic PUTs
 */

/**
 * Testing basic DELETEs
 */
