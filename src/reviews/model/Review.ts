import { Model } from '../../app/models/entity-helper';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import TableName from '../../app/database/tables.json';
import { ReviewStatus } from '../../cart/model/ReviewStatus.enum';
import { User } from '../../user/models/User';
import { Order } from '../../cart/model/Order';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { OwnerInfo } from '../../product/models/OwnerInfo';

@Entity({
  name: TableName.Reviews,
})
export class Review extends Model {
  static public = ['id', 'rating', 'user', 'comment', 'updatedAt'];

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    enum: ReviewStatus,
    default: ReviewStatus.PendingApproval,
  })
  status: ReviewStatus;

  @Column({
    nullable: false,
  })
  userId!: number;

  @ManyToOne(() => User)
  user: User;

  @Column({
    nullable: false,
  })
  orderId!: number;

  @ManyToOne(() => Order)
  order: Order;

  @Column({
    nullable: false,
    enum: ProductOwner,
  })
  sellerType: ProductOwner;

  @Column({
    nullable: false,
  })
  sellerId: number;

  @Column({
    nullable: false,
    default: 0,
  })
  rating: number;

  @Column({
    nullable: true,
    default: null,
  })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  setRating(rating: number) {
    rating = Math.min(5, Math.max(0, rating || 0));
    const ratingChanged = (this.rating || 0) !== rating;
    this.rating = rating;
    return ratingChanged;
  }

  toJson(): Record<string, any> {
    const review = super.toJson();
    review.user = OwnerInfo.from(this.user);
    return review;
  }
}
