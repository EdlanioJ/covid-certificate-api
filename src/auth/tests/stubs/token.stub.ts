import { Tokens } from '../../types/tokens.type';

export const tokenStub = () => 'token';

export const tokensStub = (): Tokens => ({
  access_token: 'access_token',
  refresh_token: 'refresh_token',
});
