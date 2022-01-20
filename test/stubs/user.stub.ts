import { User } from '../../src/users/entities/user.entity';

export const userStub = (): User =>
  new User({
    avatar: 'avatar',
    certificateId: 'certificateId',
    createdAt: new Date(2022, 1, 10),
    id: 'id',
    username: 'username',
  });
