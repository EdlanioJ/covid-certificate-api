import { ApiProperty } from '@nestjs/swagger';

export class Cases {
  @ApiProperty()
  country: string;

  @ApiProperty()
  cases: number;

  @ApiProperty()
  todayCases: number;

  @ApiProperty()
  deaths: number;

  @ApiProperty()
  todayDeaths: number;

  @ApiProperty()
  recovered: number;

  @ApiProperty()
  todayRecovered: number;

  @ApiProperty()
  active: number;

  @ApiProperty()
  critical: number;

  @ApiProperty()
  updated: Date;

  constructor(partial: Partial<Cases>) {
    Object.assign(this, partial);
  }
}
