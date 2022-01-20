import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';

import { JwtGuard } from '../auth/guards/jwt.guard';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({
    type: User,
    description: 'Get profile if authenticated',
  })
  @Get('profile')
  findOne(@GetCurrentUser('sub') userId: string) {
    return this.userService.findOne(userId);
  }
}
