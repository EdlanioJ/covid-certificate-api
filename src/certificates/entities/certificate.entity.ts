import { ApiProperty } from '@nestjs/swagger';

export class Dose {
  @ApiProperty()
  date: Date;

  @ApiProperty()
  lotNumber: string;

  @ApiProperty()
  location: string;
}

export class Certificate {
  @ApiProperty()
  id: string;

  @ApiProperty()
  certificateId: string;

  @ApiProperty()
  certificateOwnerName: string;

  @ApiProperty()
  certificateImageSource: string;

  @ApiProperty()
  certificateIssueDate: Date;

  @ApiProperty()
  vaccineName: string;

  @ApiProperty({ type: Dose, isArray: true })
  vaccineDoses: Dose[];

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<Certificate>) {
    Object.assign(this, partial);
  }
}
