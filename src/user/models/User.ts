import { Session } from '../../auth/models/Session';
import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Model } from '../../app/models/entity-helper';
import TableName from '../../app/database/tables.json';
import { UserRole } from './UserRole';
import { ShopToUser } from '../../shop/models/ShopToUser';
import { Shop } from '../../shop/models/Shop';
import { Currency } from '../../payment/model/currency.enum';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { UserSocial } from '../../auth/models/UserSocial';

@Entity({
  name: TableName.Users,
})
export class User extends Model {
  public readonly type = ProductOwner.User as const;

  $isOnline = false;

  public static fillable = ['email', 'firstName', 'lastName', 'description', 'phone'];

  protected static public = [
    'id',
    'uuid',
    'url',
    'image',
    'rating',
    'productsSold',
    'email',
    'phone',
    'firstName',
    'lastName',
  ];

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({
    nullable: false,
    type: 'char',
    length: 36,
    unique: true,
  })
  @Generated('uuid')
  uuid: string;

  @Column({
    nullable: true,
    unique: true,
  })
  url: string;

  @Column({
    nullable: false,
    default: 0,
  })
  status: number; // future maybe add enum with banned, active, etc

  @Column({
    enum: UserRole,
    nullable: true,
    default: null,
  })
  role: number | null;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    unique: true,
  })
  phone: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    select: false,
  })
  password: string;

  @Column({
    unique: true,
    select: false,
  })
  verificationCode: string;

  @Column({
    enum: Currency,
    nullable: true,
    default: null,
  })
  currency: Currency = Currency.USD;

  @Column({
    nullable: true,
    default: null,
  })
  image: string | null;

  @Column({
    nullable: false,
    default: 0,
    type: 'decimal',
    precision: 2,
    scale: 1,
  })
  rating: number;

  @Column({
    nullable: true,
    default: null,
  })
  description: string | null;

  @Column({
    nullable: false,
    default: 0,
  })
  productsSold: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({
    select: false,
  })
  updatedAt: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions: Session[];

  @OneToMany(() => UserSocial, (session) => session.user)
  socials: Session[];

  @OneToMany(() => ShopToUser, (shopToUser) => shopToUser.user)
  public shops!: Shop[];
}
