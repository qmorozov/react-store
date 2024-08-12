import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/models/User';
import TableName from '../../app/database/tables.json';

export enum UserSocialType {
  Google = 'google',
  Facebook = 'facebook',
  // Apple = 'apple',
}

@Entity({
  name: TableName.UserSocials,
})
export class UserSocial {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.socials)
  user: User;

  @Column({
    nullable: false,
    enum: UserSocialType,
  })
  type: UserSocialType;

  @Column({
    nullable: false,
  })
  socialId: string;
}
