import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/models/User';
import { Model } from '../../app/models/entity-helper';
import TableName from '../../app/database/tables.json';

@Entity({
  name: TableName.Sessions,
})
export class Session extends Model {
  protected static fillable = ['deviceName', 'refreshToken', 'maxAge'];

  private _maxAge: number;

  set maxAge(value: number) {
    this._maxAge = value;
    this.expiresAt = new Date(Date.now() + value);
  }

  get maxAge() {
    return this._maxAge;
  }

  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  @Column()
  deviceName: string;

  @Column()
  refreshToken: string;

  @Column()
  expiresAt: Date;
}

export function browserName(userAgent: string) {
  if (/edg/i.test(userAgent)) return 'Edge';
  if (/opr\//i.test(userAgent)) return 'Opera';
  if (/chrome|crios\//i.test(userAgent)) return 'Chrome';
  if (/firefox|iceweasel\//i.test(userAgent)) return 'Firefox';
  if (/safari\//i.test(userAgent)) return 'Safari';
  if (/trident\//i.test(userAgent)) return 'Internet Explorer';
  return 'Other';
}
