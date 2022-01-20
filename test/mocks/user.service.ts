import { userStub } from '../stubs/user.stub';

export const UserService = jest.fn().mockReturnValue({
  findOne: jest.fn().mockResolvedValue(userStub()),
});
