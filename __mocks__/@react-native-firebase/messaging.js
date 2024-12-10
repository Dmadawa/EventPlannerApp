export default {
    onMessage: jest.fn(),
    requestPermission: jest.fn(),
    getToken: jest.fn(() => Promise.resolve('mockToken')),
  };