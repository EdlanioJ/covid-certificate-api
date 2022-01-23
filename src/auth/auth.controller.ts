import {
  Controller,
  Get,
  HttpCode,
  UseGuards,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiHeader,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { Response } from 'express';
import * as url from 'url';

import { AuthService } from './auth.service';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { Public } from './decorators/public.decorator';
import { Tokens } from './entities/tokens.entity';
import { GoogleMobileGuard } from './guards/google-mobile.guard';
import { GoogleGuard } from './guards/google.guard';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { AuthPayload } from './types/payload.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @ApiExcludeEndpoint()
  @Get('google')
  @UseGuards(GoogleGuard)
  googleLogin() {}

  @Get('google/mobile')
  @UseGuards(GoogleMobileGuard)
  googleLoginMobile() {}

  @ApiExcludeEndpoint()
  @Get('google/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleGuard)
  async googleLoginCallback(@GetCurrentUser() user: AuthPayload) {
    return this.authService.login(user);
  }

  @Get('google/mobile/callback')
  @UseGuards(GoogleMobileGuard)
  async googleCallbackMobile(
    @Res() res: Response,
    @GetCurrentUser() user: AuthPayload,
  ) {
    const { access_token, refresh_token } = await this.authService.login(user);

    const uri = url.format({
      protocol: 'https',
      hostname: this.configService.get('MOBILE_AUTH_HOSTNAME'),
      pathname: this.configService.get('MOBILE_AUTH_PATHNAME'),
      query: {
        access_token,
        refresh_token,
      },
    });

    return res.redirect(uri);
  }

  @ApiHeader({
    name: 'Authorization',
    example: 'Bearer accessToken',
    required: true,
    explode: true,
  })
  @ApiNoContentResponse({ description: 'Logout' })
  @Get('logout')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@GetCurrentUser('sub') userId: string) {
    return this.authService.logout(userId);
  }

  @ApiOkResponse({
    description: 'Update access and refresh tokens',
    type: Tokens,
  })
  @ApiBearerAuth()
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtGuard)
  refreshTokens(
    @GetCurrentUser('sub') userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
