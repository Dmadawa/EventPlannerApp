import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const apiService = {
  fetchPhotos: async () => {
    const response = await axios.get(`${BASE_URL}/photos`);
    return response.data.slice(0, 10);
  },
  fetchUsers: async () => {
    const response = await axios.get(`${BASE_URL}/users`);
    return response.data.slice(0, 3);;
  },
  fetchPosts: async () => {
    const response = await axios.get(`${BASE_URL}/posts`);
    return response.data;
  },
};

export default apiService;
