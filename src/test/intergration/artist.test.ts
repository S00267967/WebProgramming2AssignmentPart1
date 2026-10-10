import request from "supertest";
import { app } from "../../../src/app";
import { env } from "../../../src/config/env";

const KEY = env.apiKey;
const BASE = '/api/v1/artists';
const MISSING_ID = '000000000000000000000000';

describe('Artists API', () => {
  it('returns 401 without an api key', async () => {
    const res = await request(app).get(BASE);
    expect(res.status).toBe(401);
  });

  it('returns 400 when creating an artist with no name', async () => {
    const res = await request(app).post(BASE).set('x-api-key', KEY).send({ country: 'UK' });
    expect(res.status).toBe(400);
  });

  it('creates, gets, updates and deletes an artist', async () => {
    // create
    const created = await request(app).post(BASE).set('x-api-key', KEY).send({ name: 'Test Artist' });
    expect(created.status).toBe(201);
    expect(created.body.name).toBe('Test Artist');
    const id = created.body._id;

    // get one
    const found = await request(app).get(`${BASE}/${id}`).set('x-api-key', KEY);
    expect(found.status).toBe(200);
    expect(found.body.name).toBe('Test Artist');

    // update
    const updated = await request(app).put(`${BASE}/${id}`).set('x-api-key', KEY)
      .send({ name: 'Renamed Artist' });
    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe('Renamed Artist');

    // delete
    const deleted = await request(app).delete(`${BASE}/${id}`).set('x-api-key', KEY);
    expect(deleted.status).toBe(200);

    // it should be gone now
    const gone = await request(app).get(`${BASE}/${id}`).set('x-api-key', KEY);
    expect(gone.status).toBe(404);
  });

  it('returns 404 for an artist that does not exist', async () => {
    const res = await request(app).get(`${BASE}/${MISSING_ID}`).set('x-api-key', KEY);
    expect(res.status).toBe(404);
  });

  it('returns 400 for a badly formed id', async () => {
    const res = await request(app).get(`${BASE}/not-an-id`).set('x-api-key', KEY);
    expect(res.status).toBe(400);
  });
});
