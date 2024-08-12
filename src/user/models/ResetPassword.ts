import { User } from './User';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from 'src/app/models/entity-helper';
import ShortUniqueId from 'short-unique-id';
import TableName from '../../app/database/tables.json';

const generateToken = new ShortUniqueId({ length: 64 });

@Entity({
  name: TableName.ResetPassword,
})
export class ResetPassword extends Model {
  protected static fillable = ['token'];

  static for(user: User): ResetPassword {
    const resetPassword = new ResetPassword();
    resetPassword.user = user;
    return resetPassword;
  }

  generateNewToken(): this {
    this.token = generateToken.rnd();
    return this;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ unique: true })
  token: string;
}
