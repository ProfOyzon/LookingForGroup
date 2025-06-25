import request from 'supertest';
import { expect, test } from 'vitest';
import app from '#app';

test('/', async () => {
  const res = await request(app).get('');

  expect(res.statusCode).toBe(200);
  expect(res.headers['content-type']).toBe('application/json; charset=utf-8');
  expect(res.body).toEqual({ message: 'You Reached The Looking For Group API' });
});
