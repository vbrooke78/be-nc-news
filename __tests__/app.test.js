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
    it('status: 200, updates article with comment_count property', () => {
      return request(app)
        .get('/api/articles/3')
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.comment_count).toBe(2);
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

  describe('GET /api/users', () => {
    it('status: 200', () => {
      return request(app).get('/api/users').expect(200);
    });
    it('status:200, should return an object {"users": array of user objects}', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          expect(
            users.forEach((user) => {
              expect.objectContaining({
                username: expect.any(String),
              });
            })
          );
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

  describe('GET /api/articles', () => {
    it('status: 200', () => {
      return request(app).get('/api/articles').expect(200);
    });
    it('status: 200, should return an object {articles: array of articles objects', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(12);
          expect(
            articles.forEach((article) => {
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              });
            })
          );
        });
    });
    it('status: 200, articles should be sorted by date in descending order', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('created_at', { descending: true });
        });
    });
    it('status: 200, updates articles with comment_count property', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    it('status: 200, allow sort_by queries - defaults to date', () => {
      return request(app)
        .get('/api/articles?sort_by=author')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('author', { descending: true });
        });
    });
    it('status: 400, returns Invalid sort_by query when passed an invalid sort_by', () => {
      return request(app)
        .get('/api/articles?sort_by=invalidSort_by')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Invalid sort_by query');
        });
    });
    it('status: 200, allow order by asc or desc queries - defaults to desc', () => {
      return request(app)
        .get('/api/articles?sort_by=author&order=asc')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('author');
        });
    });
    it('status: 400, returns Invalid order query when passed an invalid order', () => {
      return request(app)
        .get('/api/articles?order=invalidOrder')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Invalid order query');
        });
    });
    it('status: 200, allow user to filter by topic', () => {
      return request(app)
        .get('/api/articles?topic=cats  ')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toHaveLength(1);
          expect(
            articles.forEach((article) => {
              expect.objectContaining({ topic: 'cats' });
            })
          );
        });
    });
    it('status: 200, returns empty array when topic has no associated articles', () => {
      return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toEqual([]);
        });
    });
    it('status: 404, returns topic not found query when passed an invalid topic', () => {
      return request(app)
        .get('/api/articles?topic=invalidTopic')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Topic not found: invalidTopic');
        });
    });
  });

  describe('GET /api/articles/:article_id/comments', () => {
    it('status: 200', () => {
      return request(app).get('/api/articles/3/comments').expect(200);
    });
    it('status: 200, should return an object {"comments": array of comment objects}', () => {
      return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toHaveLength(2);
          expect(
            comments.forEach((comment) => {
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              });
            })
          );
        });
    });
    it('status: 404, responds with msg: "article_id not found" when passed a valid but non-existent id ', () => {
      return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('No such article_id: 9999');
        });
    });
    it('status: 400, responds with msg: "bad request" when passed an invalid id ', () => {
      return request(app)
        .get('/api/articles/notValidId/comments')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    it('status: 200, responds with empty array when article has no associated comments', () => {
      return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
  });

  describe('POST /api/articles/:article_id/comments', () => {
    it('status: 201, responds with posted comment', () => {
      const newComment = {
        username: 'rogersop',
        body: 'An SQL query walks into a bar, walks up to two tables and asks "Can I join you?"',
      };
      return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(comment.author).toBe('rogersop');
          expect(comment.body).toBe(
            'An SQL query walks into a bar, walks up to two tables and asks "Can I join you?"'
          );
        });
    });
    it('status: 400, should respond with message: "bad request" when body malformed or missing required fields', () => {
      const newComment = {};
      return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
    it('status: 404 should respond with message: "No such username" when body contains unknown user', () => {
      const newComment = {
        username: 123,
        body: 'An SQL query walks into a bar, walks up to two tables and asks "Can I join you?"',
      };
      return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('No such username: 123');
        });
    });
  });

  describe('DELETE /api/comments/:comment_id', () => {
    it('status: 204 ', () => {
      return request(app).delete('/api/comments/2').expect(204);
    });
    it('status: 204 should remove comment from database', async () => {
      await request(app).delete('/api/comments/2').expect(204);
      await request(app).get('/api/comments/2').expect(404);
    });
    it('status: 404, responds with msg: "comment not found" when passed a valid but non-existent id ', () => {
      return request(app)
        .delete('/api/comments/9999')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('No comment found for comment_id: 9999');
        });
    });
    it('status: 400, responds with msg: "bad request" when passed an invalid id ', () => {
      return request(app)
        .delete('/api/comments/notValidId')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe('Bad request');
        });
    });
  });
});
