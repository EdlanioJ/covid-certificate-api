import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { mockedConfigService } from '../tests/mocks/config.service';
import { AuthPayload } from '../types/payload.type';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: ConfigService, useValue: mockedConfigService },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  it('should validate', async () => {
    const payload: AuthPayload = {
      sub: 'sub',
      username: 'username',
    };
    const response = await strategy.validate(payload);
    expect(response).toEqual(payload);
  });
});
