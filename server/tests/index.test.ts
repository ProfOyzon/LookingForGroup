import { expect, test } from 'vitest';
import request from 'supertest';
import app from '../src/index.ts';

test('/', async () => {
  const res = await request(app).get('');

  expect(res.statusCode).toBe(200);
  expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
  expect(res.body).toEqual({ message: 'You Reached The Looking For Group API' });
});
