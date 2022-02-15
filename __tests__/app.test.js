const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');
const db = require('../db/connection');

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

  describe('PATCH /api/articles/:article_id', () => {
    it('status: 200, respond with updated vote value in object {updatedArticle: {updatedArticle} when passed a positive number', () => {
      const articleUpdates = { inc_votes: 5 };
      return request(app)
        .patch('/api/articles/1')
        .send(articleUpdates)
        .expect(200)
        .then(({ body }) => {
          expect(body.updatedArticle.article_id).toBe(1);
          expect(body.updatedArticle.votes).toBe(105);
        });
    });
    it('status: 200, respond with updated vote value in object {updatedArticle: {updatedArticle} when passed a negative number', () => {
      const articleUpdates = { inc_votes: -50 };
      return request(app)
        .patch('/api/articles/5')
        .send(articleUpdates)
        .expect(200)
        .then(({ body }) => {
          expect(body.updatedArticle.article_id).toBe(5);
          expect(body.updatedArticle.votes).toBe(-50);
        });
    });
    it('status: 400 should respond with message: "bad request" when body malformed or missing required fields', () => {
      const articleUpdates = {};
      return request(app)
        .patch('/api/articles/5')
        .send(articleUpdates)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    it('status: 400 should respond with message: "bad request" when body contains incorrect type', () => {
      const articleUpdates = { inc_votes: 'string' };
      return request(app)
        .patch('/api/articles/5')
        .send(articleUpdates)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
  });
});
