import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

import { userStub } from '../../test/stubs/user.stub';

jest.mock('./user.service', () =>
  jest.requireActual('../../test/mocks/user.service'),
);

describe('UsersController', () => {
  let controller: UserController;
  // let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
    // service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    const userId = 'userId';
    it('should return an user', async () => {
      const user = userStub();
      const response = await controller.findOne(userId);
      expect(response).toEqual(user);
    });
  });
});
