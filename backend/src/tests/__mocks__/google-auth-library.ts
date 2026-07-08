export const verifyIdTokenMock = jest.fn();

export class OAuth2Client {
  verifyIdToken = verifyIdTokenMock;
}