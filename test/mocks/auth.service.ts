import { tokensStub } from '../stubs/token.stub';

export const AuthService = jest.fn().mockReturnValue({
  logout: jest.fn().mockResolvedValue(Promise.resolve()),
  login: jest.fn().mockResolvedValue(tokensStub()),
  refreshTokens: jest.fn().mockResolvedValue(tokensStub()),
  validateOAuthLogin: jest.fn(),
});

export enum Provider {
  GOOGLE = 'google',
}
