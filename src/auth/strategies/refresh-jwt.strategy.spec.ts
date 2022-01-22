import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { mockedConfigService } from '../../../test/mocks/config.service';
import { AuthPayload } from '../types/payload.type';
import { RefreshJwtStrategy } from './refresh-jwt.strategy';

describe('RefreshJwtStrategy', () => {
  let strategy: RefreshJwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RefreshJwtStrategy,
        { provide: ConfigService, useValue: mockedConfigService },
      ],
    }).compile();
    strategy = module.get<RefreshJwtStrategy>(RefreshJwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate', async () => {
    const refreshToken = 'refreshToken';
    const req = {
      get(value: string) {
        if (value === 'authorization') return `Bearer ${refreshToken}`;
      },
    } as Request;
    const payload: AuthPayload = {
      sub: 'sub',
      username: 'username',
    };
    const response = await strategy.validate(req, payload);
    expect(response).toEqual({ ...payload, refreshToken });
  });
});
