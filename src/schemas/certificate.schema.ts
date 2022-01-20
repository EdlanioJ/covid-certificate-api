import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserModelName } from './user.schema';

export type CertificateDocument = CertificateModel & Document;

@Schema({ _id: false })
export class Dose {
  @Prop()
  date: Date;

  @Prop()
  lotNumber: string;

  @Prop()
  location: string;
}
const DoseSchema = SchemaFactory.createForClass(Dose);

export const CertificateModelName = 'certificate';

@Schema()
export class CertificateModel {
  id: Types.ObjectId;

  @Prop({ unique: true, required: true })
  certificateId: string;

  @Prop({ required: true })
  certificateOwnerName: string;

  @Prop({ required: true })
  certificateImageSource: string;

  @Prop({ required: true })
  certificateIssueDate: Date;

  @Prop({ required: true })
  vaccineName: string;

  @Prop({
    type: [DoseSchema],
  })
  vaccineDoses: Dose[];

  @Prop({
    type: Types.ObjectId,
    ref: UserModelName,
    index: true,
    required: true,
  })
  ownerId: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const CertificateSchema = SchemaFactory.createForClass(CertificateModel);
