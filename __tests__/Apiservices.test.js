import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import apiService from '../services/apiServices';

describe('apiService', () => {
  let mock;

  beforeEach(() => {
    // Initialize axios-mock-adapter
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    // Reset the mock adapter after each test
    mock.reset();
  });

  test('fetchPhotos should fetch the first 10 photos', async () => {
    const mockPhotos = Array.from({ length: 20 }, (_, index) => ({
      id: index + 1,
      title: `Photo ${index + 1}`,
      url: `https://example.com/photo${index + 1}.jpg`,
    }));

    mock.onGet('https://jsonplaceholder.typicode.com/photos').reply(200, mockPhotos);

    const photos = await apiService.fetchPhotos();

    expect(photos).toHaveLength(10);
    expect(photos[0].id).toBe(1);
    expect(photos[9].id).toBe(10);
  });

  test('fetchUsers should fetch users', async () => {
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' },
    ];

    mock.onGet('https://jsonplaceholder.typicode.com/users').reply(200, mockUsers);

    const users = await apiService.fetchUsers();

    expect(users).toHaveLength(2);
    expect(users[0].name).toBe('User 1');
    expect(users[1].email).toBe('user2@example.com');
  });

  test('fetchPosts should fetch posts', async () => {
    const mockPosts = [
      { id: 1, title: 'Post 1', body: 'Content of post 1' },
      { id: 2, title: 'Post 2', body: 'Content of post 2' },
    ];

    mock.onGet('https://jsonplaceholder.typicode.com/posts').reply(200, mockPosts);

    const posts = await apiService.fetchPosts();

    expect(posts).toHaveLength(2);
    expect(posts[0].title).toBe('Post 1');
    expect(posts[1].body).toBe('Content of post 2');
  });

  test('fetchPhotos should handle errors', async () => {
    mock.onGet('https://jsonplaceholder.typicode.com/photos').reply(500);

    await expect(apiService.fetchPhotos()).rejects.toThrow('Request failed with status code 500');
  });
});
