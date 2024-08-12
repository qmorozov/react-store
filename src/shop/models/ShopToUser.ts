import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import TableName from '../../app/database/tables.json';
import { ShopUserRole } from './ShopUserRole.enum';
import { Shop } from './Shop';
import { User } from '../../user/models/User';

@Entity({
  name: TableName.ShopToUser,
})
export class ShopToUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  shopId!: number;

  @Column({
    nullable: false,
  })
  userId!: number;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ShopUserRole,
    default: ShopUserRole.Admin,
  })
  role!: ShopUserRole;

  @ManyToOne(() => Shop, (shop) => shop.users)
  public shop!: Shop;

  @ManyToOne(() => User, (user) => user.shops)
  public user!: User;
}
