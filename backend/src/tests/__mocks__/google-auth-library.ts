export const verifyIdTokenMock = jest.fn();

// Ensure the class structure returns an object containing the tracked mock function when instantiated via 'new'
export const OAuth2Client = jest.fn().mockImplementation(() => {
  return {
    verifyIdToken: verifyIdTokenMock,
  };
});