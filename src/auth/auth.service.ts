import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { AuthPayload } from './types/payload.type';
import { CreateUserDto } from './dto/create-user.dto';

import { UserModelName, UserDocument } from '../schemas/user.schema';
import { Tokens } from './types/tokens.type';

export enum Provider {
  GOOGLE = 'google',
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(UserModelName) private readonly userModel: Model<UserDocument>,
    private readonly configService: ConfigService,
  ) {}

  async validateOAuthLogin(details: CreateUserDto) {
    const user = await this.userModel.findOne({
      thirdPartyId: details.thirdPartyId,
    });

    if (user) {
      return this.userModel.findByIdAndUpdate(user.id, {
        ...details,
        updatedAt: new Date(),
      });
    }

    return this.userModel.create(details);
  }

  async login(payload: AuthPayload) {
    const tokens = await this.getTokens(payload.sub, payload.username);
    await this.updateRefreshTokenHash(payload.sub, tokens.refresh_token);
    return tokens;
  }

  async logout(userId: string) {
    await this.userModel.updateOne(
      {
        id: userId,
        refreshToken: { $exists: true },
      },
      { $unset: { refreshToken: '' } },
    );
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userModel.findById(userId);

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access  Denied');

    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenMatches) throw new ForbiddenException('Access  Denied');

    const tokens = await this.getTokens(userId, user.username);
    await this.updateRefreshTokenHash(user._id, tokens.refresh_token);
    return tokens;
  }

  private hashData(data: string) {
    return bcrypt.hash(data, 12);
  }

  private async getTokens(userId: string, username: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          expiresIn: this.configService.get<number>('JWT_SECRET_EXPIRE_IN'),
          secret: this.configService.get('JWT_SECRET'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          expiresIn: this.configService.get('JWT_REFRESH_SECRET_EXPIRE_IN'),
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        },
      ),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hash = await this.hashData(refreshToken);

    await this.userModel.findByIdAndUpdate(userId, {
      $set: { refreshToken: hash },
    });
  }
}
