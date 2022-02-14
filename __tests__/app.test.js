const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const db = require('../db/connection');

beforeEach(() => seed(data));

afterAll(() => db.end());

describe('app', () => {
  describe('GET /api/topics', () => {
    it('status: 200', () => {
      return request(app).get('/api/topics').expect(200);
    });
    it('status:200, should return an array of topic objects', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then((result) => {
          expect(result.body).toHaveLength(3);
          expect(
            result.body.forEach((topic) => {
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              });
            })
          );
        });
    });
    it('status: 404, should respond with message: path not found when invalid path requested', () => {
      return request(app)
        .get('/api/invalidPath')
        .expect(404)
        .then((res) => {
          expect(res.body).toEqual({ msg: 'path not found' });
        });
    });
  });
});
