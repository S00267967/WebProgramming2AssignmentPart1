import request from "supertest";
import { app } from "../../app";

const API_KEY = '123456';
const BASE = '/api/v1/cars';

const validCar = { make: 'TestMake', model: 'TestModel', year: 2020 };

describe('Cars API', () => {
  it('GET /cars returns 200 and an array', async () => {
    const response = await request(app).get(BASE).set('x-api-key', API_KEY);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('returns 401 when the api key is missing', async () => {
    const response = await request(app).get(BASE);

    expect(response.status).toBe(401);
  });

  it('POST /cars returns 400 for invalid data', async () => {
    const response = await request(app)
      .post(BASE)
      .set('x-api-key', API_KEY)
      .send({ make: 'NoModel' });

    expect(response.status).toBe(400);
  });

  it('POST /cars returns 400 for a year that is too early', async () => {
    const response = await request(app)
      .post(BASE)
      .set('x-api-key', API_KEY)
      .send({ ...validCar, year: 1900 });

    expect(response.status).toBe(400);
  });

  it('creates, reads, updates and deletes a car', async () => {
    // create
    const created = await request(app)
      .post(BASE)
      .set('x-api-key', API_KEY)
      .send(validCar);

    expect(created.status).toBe(201);
    expect(created.body).toMatchObject(validCar);
    const id = created.body._id;
    expect(id).toBeDefined();

    // read it back
    const fetched = await request(app).get(`${BASE}/${id}`).set('x-api-key', API_KEY);

    expect(fetched.status).toBe(200);
    expect(fetched.body).toMatchObject(validCar);

    // update
    const updated = await request(app)
      .put(`${BASE}/${id}`)
      .set('x-api-key', API_KEY)
      .send({ ...validCar, model: 'UpdatedModel' });

    expect(updated.status).toBe(200);
    expect(updated.body.model).toBe('UpdatedModel');

    // delete
    const deleted = await request(app).delete(`${BASE}/${id}`).set('x-api-key', API_KEY);

    expect(deleted.status).toBe(200);

    // should now be gone
    const gone = await request(app).get(`${BASE}/${id}`).set('x-api-key', API_KEY);

    expect(gone.status).toBe(404);
  });

  it('PUT /cars/:id returns 404 for a car that does not exist', async () => {
    const response = await request(app)
      .put(`${BASE}/000000000000000000000000`)
      .set('x-api-key', API_KEY)
      .send(validCar);

    expect(response.status).toBe(404);
  });

  it('DELETE /cars/:id returns 404 for a car that does not exist', async () => {
    const response = await request(app)
      .delete(`${BASE}/000000000000000000000000`)
      .set('x-api-key', API_KEY);

    expect(response.status).toBe(404);
  });
});