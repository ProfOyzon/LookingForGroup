import util from '../../client/src/api/index.js';
import { expect, test } from 'vitest';

/**
 *
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
