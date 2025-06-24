import util from '../../client/src/api/index.js';
import { expect, test } from 'vitest';

/**
 * Test basic gets
 */
test('lfg: Test gets users', async () => {
  const apiURL = 'https://lfg.gccis.rit.edu/api/users';
  const result = await util.GET(apiURL);
  expect(result.status).toBe(200);
});

test('local: Test gets users', async () => {
  const apiURL = 'http://localhost:8081/api/users';
  const result = await util.GET(apiURL);
  expect(result.status).toBe(200);
});

test('lfg: Test gets projects', async () => {
  const apiURL = 'https://lfg.gccis.rit.edu/api/projects';
  const result = await util.GET(apiURL);
  expect(result.status).toBe(200);
});

test('local: Test gets projects', async () => {
  const apiURL = 'http://localhost:8081/api/projects';
  const result = await util.GET(apiURL);
  expect(result.status).toBe(200);
});
