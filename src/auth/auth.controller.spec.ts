/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import * as httpMock from 'node-mocks-http';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';

import { tokensStub } from '../../test/stubs/token.stub';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthPayload } from './types/payload.type';
import { GetCurrentUser } from './decorators/get-current-user.decorator';

jest.mock('./auth.service', () =>
  jest.requireActual('../../test/mocks/auth.service'),
);

function getDecoratorFactory(decorator: any) {
  class Test {
    test(@decorator('sub') value) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return args[Object.keys(args)[0]].factory;
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call googleLogin', () => {
    controller.googleLogin();
  });
  describe('googleLoginCallback', () => {
    const authPayload: AuthPayload = {
      sub: 'sub',
      username: 'username',
    };

    it('should call authService.login', async () => {
      const spy = jest.spyOn(authService, 'login');
      const tokens = await controller.googleLoginCallback(authPayload);
      expect(spy).toHaveBeenCalledWith(authPayload);
      expect(tokens).toEqual(tokensStub());
    });
  });

  describe('logout', () => {
    const userId = 'userId';
    it('should call auhService.logout', async () => {
      const spy = jest.spyOn(authService, 'logout');
      await controller.logout(userId);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(userId);
    });
  });

  describe('refreshTokens', () => {
    const userId = 'userId';
    const refreshToken = 'refreshToken';

    it('should call authService.refreshTokens', async () => {
      const spy = jest.spyOn(authService, 'refreshTokens');
      const tokens = await controller.refreshTokens(userId, refreshToken);
      expect(spy).toHaveBeenCalledWith(userId, refreshToken);
      expect(tokens).toEqual(tokensStub());
    });
  });

  describe('GetCurrentUserDecorator', () => {
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    const mockUser = { sub: 'sub', username: 'username' };
    req.user = mockUser;

    it('should return a user', async () => {
      const ctx = new ExecutionContextHost(
        [req, res],
        // @ts-ignore
        controller,
        controller.googleLoginCallback,
      );
      const factory = getDecoratorFactory(GetCurrentUser);
      const user = factory(null, ctx);
      expect(user).toEqual(mockUser);
    });
    it('should return a user sub', async () => {
      const ctx = new ExecutionContextHost(
        [req, res],
        // @ts-ignore
        controller,
        controller.logout,
      );
      const factory = getDecoratorFactory(GetCurrentUser);
      const sub = factory('sub', ctx);
      expect(sub).toEqual(mockUser.sub);
    });
  });
});
