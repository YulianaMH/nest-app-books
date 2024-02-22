import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection, connect, disconnect } from 'mongoose';
import { AppModule } from '../src/app.module';
import { Category, StatusType } from '../src/book/schema/book.schema';

describe('Book & Auth controller (e2e)', () => {
  let app: INestApplication;
  let mongoConnection: Connection;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  beforeAll(async () => {
    mongoConnection = (await connect(process.env.DB_URI)).connection;
    await mongoConnection.db.dropDatabase();
  });

  afterAll(async () => {
    await mongoConnection.close();
    disconnect();
  });

  let token = '';
  let bookCreated;
  let updatedBook;

  describe('Auth', () => {
    const user = {
      name: 'yuliana',
      email: 'yuliana@gmail.com',
      password: '1234',
    };

    it('(POST) - Register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(201)
        .then((res) => {
          expect(res.body.token).toBeDefined();
        });
    });

    it('(GET) - Login a registered user', () => {
      return request(app.getHttpServer())
        .get('/auth/login')
        .send({ email: user.email, password: user.password })
        .expect(200)
        .then((res) => {
          expect(res.body.token).toBeDefined();
          token = res.body.token;
        });
    });
  });

  describe('Book', () => {
    const newBook = {
      title: 'Book 5',
      author: 'Author 3',
      price: 500,
      category: Category.ADVENTURE,
      editorial: 'Editorial 3',
      status: StatusType.IN_STOCKE,
    };

    it('(POST) - Create new book', () => {
      return request(app.getHttpServer())
        .post('/book')
        .set('Authorization', 'Bearer ' + token)
        .send(newBook)
        .expect(201)
        .then((res) => {
          expect(res.body._id).toBeDefined();
          expect(res.body.title).toEqual(newBook.title);
          bookCreated = res.body;
        });
    });

    it('(GET) - Get all books', () => {
      return request(app.getHttpServer())
        .get('/book')
        .expect(200)
        .then((res) => {
          expect(res.body.length).toBe(1);
        });
    });

    it('(GET) - Get a book by id', () => {
      return request(app.getHttpServer())
        .get(`/book/${bookCreated?._id}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body._id).toEqual(bookCreated._id);
        });
    });

    it('(PATCH) - Update a book by id', () => {
      const updateBookProperties = { title: 'Updated name' };
      return request(app.getHttpServer())
        .patch(`/book/${bookCreated?._id}`)
        .set('Authorization', 'Bearer ' + token)
        .send(updateBookProperties)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body.title).toEqual(updateBookProperties.title);
          updatedBook = res.body;
        });
    });

    it('(DELETE) - Delete a book by id', () => {
      return request(app.getHttpServer())
        .delete(`/book/${bookCreated?._id}`)
        .expect(200)
        .then((res) => {
          expect(res.body).toBeDefined();
          expect(res.body).toEqual(updatedBook);
        });
    });
  });
});
