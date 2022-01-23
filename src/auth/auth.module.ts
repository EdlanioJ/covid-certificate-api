import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { UserModelName, UserSchema } from '../schemas/user.schema';
import { GoogleMobileStrategy } from './strategies/google-mobile.strategy';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModelName, schema: UserSchema }]),
    PassportModule,
    JwtModule.register({}),
  ],
  exports: [AuthService, JwtStrategy],
  providers: [
    AuthService,
    GoogleStrategy,
    GoogleMobileStrategy,
    JwtStrategy,
    RefreshJwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
