const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const db = require('../db/connection');
const { convertTimestampToDate } = require('../db/helpers/utils');

beforeEach(() => seed(data));

afterAll(() => db.end());

describe('app', () => {
  it('status: 404, should respond with message: path not found when invalid path requested', () => {
    return request(app)
      .get('/api/invalidPath')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('path not found');
      });
  });

  describe('GET /api/topics', () => {
    it('status: 200', () => {
      return request(app).get('/api/topics').expect(200);
    });
    it('status:200, should return an object {"topic": array of topic objects}', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).toHaveLength(3);
          expect(
            topics.forEach((topic) => {
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              });
            })
          );
        });
    });
  });

  describe('GET /api/articles/:article_id', () => {
    it('status: 200', () => {
      return request(app).get('/api/articles/2').expect(200);
    });
    it('status: 200, responds with an article object', () => {
      return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
    });
    it('status: 404, responds with msg: "article not found" when passed a valid but non-existent id ', () => {
      return request(app)
        .get('/api/articles/9999')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('No article found for article_id: 9999');
        });
    });
    it('status: 400, responds with msg: "bad request" when passed an invalid id ', () => {
      return request(app)
        .get('/api/articles/notValidId')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
  });
});
