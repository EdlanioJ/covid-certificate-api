import {
  Controller,
  Get,
  HttpCode,
  UseGuards,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNoContentResponse,
  ApiHeader,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GetCurrentUser } from './decorators/get-current-user.decorator';
import { Public } from './decorators/public.decorator';
import { Tokens } from './entities/tokens.entity';
import { GoogleGuard } from './guards/google.guard';
import { JwtGuard } from './guards/jwt.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt.guard';
import { AuthPayload } from './types/payload.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiExcludeEndpoint()
  @Get('google')
  @UseGuards(GoogleGuard)
  googleLogin() {
    return;
  }

  @ApiExcludeEndpoint()
  @Public()
  @Get('google/callback')
  @HttpCode(HttpStatus.OK)
  @UseGuards(GoogleGuard)
  async googleLoginCallback(@GetCurrentUser() user: AuthPayload) {
    return this.authService.login(user);
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
