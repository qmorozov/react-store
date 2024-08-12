import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import TableName from '../../app/database/tables.json';
import { Model } from '../../app/models/entity-helper';

@Entity({
  name: TableName.FavoriteProducts,
})
export class FavoriteProduct extends Model {
  static create(userId: number, productId: number) {
    const favoriteProduct = new FavoriteProduct();
    favoriteProduct.userId = userId;
    favoriteProduct.productId = productId;
    return favoriteProduct;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  userId!: number;

  @Column({
    nullable: false,
  })
  productId!: number;
}
