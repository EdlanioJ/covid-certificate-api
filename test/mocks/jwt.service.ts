import { tokenStub } from '../stubs/token.stub';

export const mockedJwtService = {
  signAsync: () => Promise.resolve(tokenStub()),
};
