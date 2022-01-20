import { ApiProperty } from '@nestjs/swagger';

export class Tokens {
  @ApiProperty()
  access_token: string;

  @ApiProperty()
  refresh_token: string;

  constructor(tokens: Tokens) {
    Object.assign(this, tokens);
  }
}
