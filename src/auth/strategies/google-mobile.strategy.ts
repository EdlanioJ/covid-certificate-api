import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, Profile } from 'passport-google-oauth20';

import { AuthService, Provider } from '../auth.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthPayload } from '../types/payload.type';

@Injectable()
export class GoogleMobileStrategy extends PassportStrategy(
  Strategy,
  'google-mobile',
) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_MOBILE_CALLBACK_URL'),
      passReqToCallback: true,
      scope: ['profile'],
    });
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: Error, payload: AuthPayload) => void,
  ) {
    try {
      const { photos, id, displayName } = profile;
      const dto = new CreateUserDto();
      dto.avatar = photos[0].value;
      dto.provider = Provider.GOOGLE;
      dto.thirdPartyId = id;
      dto.username = displayName;
      const user = await this.authService.validateOAuthLogin(dto);

      const payload = { sub: user.id, username: user.username };
      done(null, payload);
    } catch (error) {
      done(error, null);
    }
  }
}
