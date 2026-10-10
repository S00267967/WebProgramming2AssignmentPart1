import request from "supertest";
import { app } from "../../../src/app";
import { env } from "../../../src/config/env";

const KEY = env.apiKey;
const BASE = '/api/v1/albums';
const MISSING_ID = '000000000000000000000000';

let artistId: string;

// make an artist for the albums to belong to
beforeAll(async () => {
  const res = await request(app).post('/api/v1/artists').set('x-api-key', KEY)
    .send({ name: 'Album Test Artist' });
  artistId = res.body._id;
});

// Sorched Earth - delete the artist and all their albums after the tests
afterAll(async () => {
  await request(app).delete(`/api/v1/artists/${artistId}`).set('x-api-key', KEY);
});

const newAlbum = (overrides = {}) => ({
  title: 'Test Album',
  artist: artistId,
  releaseYear: 2000,
  genre: 'TestGenre',
  rating: 7,
  ...overrides,
});

describe('Albums API', () => {
  it('returns 401 without an api key', async () => {
    const res = await request(app).get(BASE);
    expect(res.status).toBe(401);
  });

  it('POST fails validation when the title is missing', async () => {
    const res = await request(app).post(BASE).set('x-api-key', KEY).send(newAlbum({ title: undefined }));
    expect(res.status).toBe(400);
  });

  it('POST returns 404 when the artist does not exist', async () => {
    const res = await request(app).post(BASE).set('x-api-key', KEY).send(newAlbum({ artist: MISSING_ID }));
    expect(res.status).toBe(404);
  });

  it('creates, gets, updates and deletes an album', async () => {
    // create
    const created = await request(app).post(BASE).set('x-api-key', KEY).send(newAlbum());
    expect(created.status).toBe(201);
    expect(created.body.title).toBe('Test Album');
    const id = created.body._id;

    // get one - the artist is filled in
    const found = await request(app).get(`${BASE}/${id}`).set('x-api-key', KEY);
    expect(found.status).toBe(200);
    expect(found.body.artist.name).toBe('Album Test Artist');

    // update
    const updated = await request(app).put(`${BASE}/${id}`).set('x-api-key', KEY)
      .send(newAlbum({ title: 'Updated Title' }));
    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe('Updated Title');

    // delete
    const deleted = await request(app).delete(`${BASE}/${id}`).set('x-api-key', KEY);
    expect(deleted.status).toBe(200);

    // it should be gone now
    const gone = await request(app).get(`${BASE}/${id}`).set('x-api-key', KEY);
    expect(gone.status).toBe(404);
  });

  it('GET one returns 404 for an album that does not exist', async () => {
    const res = await request(app).get(`${BASE}/${MISSING_ID}`).set('x-api-key', KEY);
    expect(res.status).toBe(404);
  });

  it('GET one returns 400 for a badly formed id', async () => {
    const res = await request(app).get(`${BASE}/not-an-id`).set('x-api-key', KEY);
    expect(res.status).toBe(400);
  });

  it('PUT returns 404 for an album that does not exist', async () => {
    const res = await request(app).put(`${BASE}/${MISSING_ID}`).set('x-api-key', KEY).send(newAlbum());
    expect(res.status).toBe(404);
  });

  it('PUT returns 400 for invalid data', async () => {
    const res = await request(app).put(`${BASE}/${MISSING_ID}`).set('x-api-key', KEY)
      .send(newAlbum({ rating: 50 }));
    expect(res.status).toBe(400);
  });

  it('DELETE returns 404 for an album that does not exist', async () => {
    const res = await request(app).delete(`${BASE}/${MISSING_ID}`).set('x-api-key', KEY);
    expect(res.status).toBe(404);
  });

  describe('filter, sort, projection and paging', () => {
    beforeAll(async () => {
      await request(app).post(BASE).set('x-api-key', KEY).send(newAlbum({ title: 'A Old', releaseYear: 1990 }));
      await request(app).post(BASE).set('x-api-key', KEY).send(newAlbum({ title: 'B New', releaseYear: 2010 }));
      await request(app).post(BASE).set('x-api-key', KEY).send(newAlbum({ title: 'C Other', genre: 'OtherGenre' }));
    });

    it('filters by genre', async () => {
      const res = await request(app).get(`${BASE}?genre=OtherGenre&artist=${artistId}`).set('x-api-key', KEY);
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('C Other');
    });

    it('sorts by year, newest first', async () => {
      const res = await request(app).get(`${BASE}?artist=${artistId}&genre=TestGenre&sort=-releaseYear`)
        .set('x-api-key', KEY);
      expect(res.body[0].title).toBe('B New');
      expect(res.body[1].title).toBe('A Old');
    });

    it('only returns the fields asked for', async () => {
      const res = await request(app).get(`${BASE}?artist=${artistId}&fields=title`).set('x-api-key', KEY);
      expect(res.body[0].title).toBeDefined();
      expect(res.body[0].genre).toBeUndefined();
    });

    it('limits the number of results', async () => {
      const res = await request(app).get(`${BASE}?artist=${artistId}&limit=2`).set('x-api-key', KEY);
      expect(res.body).toHaveLength(2);
    });
  });
});
