import { Injectable } from '@nestjs/common';
import { CurrentUser } from '../../auth/models/CurrentUser';
import { Order } from '../../cart/model/Order';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { IsNull, Not, Repository } from 'typeorm';
import { Review } from '../model/Review';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { ProductSharedService } from '../../product/service/product.shared.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review, Database.Main) private readonly reviewsRepository: Repository<Review>,
    private readonly productSharedService: ProductSharedService,
  ) {}

  async getReviewForOrder(orderId: Order['id'], userId: CurrentUser['id']) {
    return this.reviewsRepository.findOne({
      where: {
        orderId,
        userId,
      },
      relations: ['user'],
    });
  }

  async getOrCreateReviewForOrder(order: Order, user: CurrentUser) {
    return this.getReviewForOrder(order.id, user.id)
      .catch(() => null)
      .then((review) => {
        if (!review) {
          review = new Review();
          review.orderId = order.id;
          review.userId = user.id;
          review.sellerId = order.sellerId;
          review.sellerType = order.sellerType;
        }
        return review;
      });
  }

  async save(review: Review) {
    return this.reviewsRepository.save(review);
  }

  async aggregateRatings(sellerType: ProductOwner, sellerId: number) {
    const owner = await this.productSharedService.getOwner({
      type: sellerType,
      id: sellerId,
    });

    if (owner) {
      const rating = (
        await this.reviewsRepository
          .createQueryBuilder('reviews')
          .select('AVG(rating)', 'rating')
          .where('sellerType = :sellerType', { sellerType })
          .andWhere('sellerId = :sellerId', { sellerId })
          .andWhere('rating > 0')
          .getRawOne()
      )?.rating;

      if (rating || rating === 0) {
        owner.rating = rating;
        await this.productSharedService.updateOwner(owner, { rating });
      }
    }
  }

  async getOwnerByUUID(sellerType: ProductOwner, sellerUUID: string) {
    return this.productSharedService.getOwnerByUUID(sellerType, sellerUUID);
  }

  getReviewsForSeller(type: ProductOwner, id: number) {
    return this.reviewsRepository.find({
      where: {
        sellerType: type,
        sellerId: id,
        comment: Not(IsNull()),
      },
      relations: ['user'],
    });
  }

  get repository() {
    return this.reviewsRepository;
  }
}
