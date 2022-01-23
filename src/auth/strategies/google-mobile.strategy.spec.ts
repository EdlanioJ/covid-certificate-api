import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import { Profile } from 'passport-google-oauth20';

import { AuthService } from '../auth.service';
import { mockedConfigService } from '../../../test/mocks/config.service';
import { AuthPayload } from '../types/payload.type';
import { GoogleMobileStrategy } from './google-mobile.strategy';

jest.mock('../auth.service', () =>
  jest.requireActual('../../../test/mocks/auth.service'),
);

const dMock = jest.fn() as (error: Error, payload: AuthPayload) => void;
jest.mock('express');
describe('GoogleMobileStrategy', () => {
  let strategy: GoogleMobileStrategy;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GoogleMobileStrategy,
        AuthService,
        { provide: ConfigService, useValue: mockedConfigService },
      ],
    }).compile();
    strategy = module.get<GoogleMobileStrategy>(GoogleMobileStrategy);
    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    const req = {} as Request;
    const accessToken = '_accessToken';
    const refreshToken = 'refreshToken';
    const profile = {
      photos: [{ value: 'photo' }],
      id: 'id',
      displayName: 'displayName',
    } as Profile;
    it('should return an error if service throws', async () => {
      const error = new Error('error');
      jest.spyOn(service, 'validateOAuthLogin').mockRejectedValue(error);
      await strategy.validate(req, accessToken, refreshToken, profile, dMock);
      expect(dMock).toHaveBeenCalledWith(error, null);
    });
    it('should returns a payload', async () => {
      const user = { id: 'id', username: 'username' };
      jest.spyOn(service, 'validateOAuthLogin').mockResolvedValue(user as any);
      await strategy.validate(req, accessToken, refreshToken, profile, dMock);
      expect(dMock).toHaveBeenCalledWith(null, {
        sub: user.id,
        username: user.username,
      });
    });
  });
});
