import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = UserModel & Document;

export const UserModelName = 'user';

@Schema()
export class UserModel {
  @Prop({ unique: true, required: true })
  thirdPartyId: string;

  @Prop()
  username: string;

  @Prop()
  avatar: string;

  @Prop()
  provider: string;

  @Prop()
  refreshToken: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  certificateId: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);
