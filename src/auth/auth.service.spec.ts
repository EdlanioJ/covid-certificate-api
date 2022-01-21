import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UserModelName, UserDocument } from '../schemas/user.schema';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { mockedConfigService } from './tests/mocks/config.service';
import { mockedJwtService } from './tests/mocks/jwt.service';
import { tokenStub } from './tests/stubs/token.stub';
import { userModelStub } from './tests/stubs/user-model.stub';
import { AuthPayload } from './types/payload.type';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: Model<UserDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: mockedConfigService },
        { provide: JwtService, useValue: mockedJwtService },
        {
          provide: getModelToken(UserModelName),
          useValue: Model,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get<Model<UserDocument>>(getModelToken(UserModelName));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateOAuthLogin', () => {
    const dto: CreateUserDto = {
      avatar: 'avatar',
      provider: 'provider',
      thirdPartyId: 'thirdPartyId',
      username: 'username',
    };
    it('should call update', async () => {
      const findOneSpy = jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValue(userModelStub() as any);
      const updateSpy = jest
        .spyOn(userModel, 'findByIdAndUpdate')
        .mockResolvedValue(userModelStub() as any);
      const user = await service.validateOAuthLogin(dto);
      expect(user.id).toEqual(userModelStub().id);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(updateSpy).toHaveBeenCalledTimes(1);
    });

    it('should call save', async () => {
      const findOneSpy = jest
        .spyOn(userModel, 'findOne')
        .mockResolvedValue(undefined);
      const saveSpy = jest
        .spyOn(userModel, 'create')
        .mockResolvedValue(userModelStub() as never);
      const user = await service.validateOAuthLogin(dto);
      expect(user.id).toEqual(userModelStub().id);
      expect(findOneSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('login', () => {
    const payload: AuthPayload = {
      sub: 'sub',
      username: 'username',
    };
    it('should login', async () => {
      const spy = jest.spyOn(userModel, 'findByIdAndUpdate');
      const tokens = await service.login(payload);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(tokens.access_token).toEqual(tokenStub());
      expect(tokens.refresh_token).toEqual(tokenStub());
    });
  });

  describe('refreshTokens', () => {
    const userId = 'userId';
    const refreshToken = 'refreshToken';

    it('should fail if find return undefined', async () => {
      jest.spyOn(userModel, 'findById').mockResolvedValue(undefined);
      const promise = service.refreshTokens(userId, refreshToken);
      expect(promise).rejects.toThrowError();
    });

    it('should fail if user has no refreshToken', async () => {
      const user = userModelStub();
      user.refreshToken = null;
      jest.spyOn(userModel, 'findById').mockResolvedValue(user as any);
      const promise = service.refreshTokens(userId, refreshToken);
      expect(promise).rejects.toThrowError();
    });

    it('should fail if bcrypt compare return false', async () => {
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(false);
      jest
        .spyOn(userModel, 'findById')
        .mockResolvedValue(userModelStub() as any);
      const promise = service.refreshTokens(userId, refreshToken);
      expect(promise).rejects.toThrowError();
    });

    it('should return tokens', async () => {
      (bcrypt.compare as jest.Mock) = jest.fn().mockResolvedValue(true);
      jest
        .spyOn(userModel, 'findById')
        .mockResolvedValue(userModelStub() as any);
      const updateSpy = jest.spyOn(userModel, 'findByIdAndUpdate');
      const tokens = await service.refreshTokens(userId, refreshToken);
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(tokens.access_token).toEqual(tokenStub());
      expect(tokens.refresh_token).toEqual(tokenStub());
    });
  });

  describe('logout', () => {
    const userId = 'userId';

    it('should logout', async () => {
      const spy = jest
        .spyOn(userModel, 'updateOne')
        .mockResolvedValue({} as any);
      await service.logout(userId);
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
