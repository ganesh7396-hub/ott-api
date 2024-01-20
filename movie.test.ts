// movie.test.ts
import request from 'supertest';
import app from './src/app'; // Import your Express app
import mongoose from 'mongoose';
import { config } from "./src/config/config";
import Movie from "./src/models/Movies";

beforeAll(async () => {

  mongoose.connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log("Mongo connected successfully.");

  })
  .catch((error) => console.log(error));
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('POST /add-movie', () => {
    it('should add a movie when user has admin role', async () => {
      const response = await request(app)
        .post('/add-movie')
        .send({
          user: { roleType: 'admin' },
          title: 'Inception',
          genre: 'Sci-Fi',
          releaseYear: 2010,
          director: 'Christopher Nolan',
          streamingLink: 'https://example.com/inception',
          rating: 4.5,
        })
        .expect(201);

      const { movie } = response.body;
      expect(movie).toBeDefined();
      expect(movie.title).toBe('Inception');
    });

    it('should return an error when user does not have admin role', async () => {
      const response = await request(app)
        .post('/add-movie')
        .send({
          user: { roleType: 'user' },
          title: 'Inception',
          genre: 'Sci-Fi',
          releaseYear: 2010,
          director: 'Christopher Nolan',
          streamingLink: 'https://example.com/inception',
          rating: 4.5,
        })
        .expect(500);

      const { message } = response.body;
      expect(message).toEqual("User don't have Permission");
    });
  });

  describe('GET /search-movie', () => {
    it('should search movies based on the query', async () => {
      // Add movies to the database for testing
      await Movie.create([
        {
          title: 'Inception',
          genre: 'Sci-Fi',
          releaseYear: 2010,
          director: 'Christopher Nolan',
          streamingLink: 'https://example.com/inception',
          rating: 4.5,
        },
        {
          title: 'Interstellar',
          genre: 'Sci-Fi',
          releaseYear: 2014,
          director: 'Christopher Nolan',
          streamingLink: 'https://example.com/interstellar',
          rating: 4.8,
        },
      ]);

      const response = await request(app)
        .get('/search-movie?q=Incep')
        .expect(200);

      const { data } = response.body;
      expect(data.length).toBe(1);
      expect(data[0].title).toBe('Inception');
    });

    it('should return an error for an invalid query', async () => {
      const response = await request(app)
        .get('/search-movie')
        .expect(400);

      const { error } = response.body;
      expect(error).toEqual('Invalid or missing query parameter');
    });

    it('should return 404 if no movies match the query', async () => {
      const response = await request(app)
        .get('/search-movie?q=Nonexistent')
        .expect(404);

      const { message } = response.body;
      expect(message).toEqual('Movies not found');
    });
  });