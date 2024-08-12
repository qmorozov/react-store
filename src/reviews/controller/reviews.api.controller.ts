import { BadRequestException, Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ReviewsRoute } from '../reviews.router';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { Page } from '../../pages';
import { AddOrderReviewDto } from '../../cart/dto/addOrderReview.dto';
import { OrdersService } from '../../cart/service/orders.service';
import { GetUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import { UserSignedOnly } from '../../auth/decorator/auth.decorators';
import { ReviewsService } from '../service/reviews.service';
import environment from '../../app/configuration/configuration.env';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { ActionTarget, iActionTarget } from '../../user/decorator/action.target.decorator';

@Controller(ReviewsRoute.apiController)
@ApiTags(Page.Reviews)
export class ReviewsApiController {
  constructor(private readonly ordersService: OrdersService, private readonly reviewsService: ReviewsService) {}

  @Post('order/:orderId')
  @ApiParam({ name: 'orderId', type: 'number' })
  @ApiBody({ type: AddOrderReviewDto })
  @UserSignedOnly()
  async addReviewForOrder(
    @Param('orderId') orderId: number,
    @Body() body: AddOrderReviewDto,
    @GetUser() user: CurrentUserType,
  ) {
    const order = await this.ordersService.getOrderByIdForUser(orderId, user.id);

    if (!order) {
      throw new NotFoundException();
    }

    let rating = parseInt((body.rating || 0).toFixed(0), 10);
    const comment = (body.comment || '').trim().substring(0, environment.reviews.commentMaxLength);

    if (rating < 0 || rating > 5) {
      rating = 0;
    }

    if (rating === 0 && comment.length === 0) {
      throw new BadRequestException('Please provide a rating or a comment');
    }

    const review = await this.reviewsService.getOrCreateReviewForOrder(order, user);
    review.comment = comment?.length > 0 ? comment : null;
    review.status = environment.reviews.defaultStatus;
    review.user = user;
    const ratingChanged = review.setRating(rating);

    return this.reviewsService.save(review).then((review) => {
      if (ratingChanged) {
        setTimeout(() => this.reviewsService.aggregateRatings(review.sellerType, review.sellerId));
      }
      return review.toJson();
    });
  }

  @Get('order/:orderId')
  @ApiParam({ name: 'orderId', type: 'number' })
  @UserSignedOnly()
  async getReviewForOrder(@Param('orderId') orderId: number, @GetUser() user: CurrentUserType) {
    return this.reviewsService.getReviewForOrder(orderId, user.id).then((review) => review?.toJson() || null);
  }

  @Get('list/mine')
  @UserSignedOnly()
  async getMyReviews(@GetUser() user: CurrentUserType) {
    return this.reviewsService.repository
      .find({
        where: {
          userId: user.id,
        },
        relations: {
          user: true,
        },
      })
      .then((res) => res.map((review) => review.toJson()));
  }

  @Get('list/forme')
  @UserSignedOnly()
  async getForMeReviews(@ActionTarget() target: iActionTarget) {
    return this.reviewsService.repository
      .find({
        where: {
          sellerId: target.id as number,
          sellerType: target.type,
        },
        relations: {
          user: true,
        },
      })
      .then((res) => res.map((review) => review.toJson()));
  }

  @Get('/:sellerType/:sellerUUID')
  @ApiParam({ name: 'sellerType', type: 'string', enum: ProductOwner })
  @ApiParam({ name: 'sellerUUID', type: 'string' })
  async getReviewsForSeller(@Param('sellerType') sellerType: ProductOwner, @Param('sellerUUID') sellerUUID: string) {
    const owner = await this.reviewsService.getOwnerByUUID(sellerType, sellerUUID);

    if (!owner) {
      throw new NotFoundException();
    }

    return this.reviewsService
      .getReviewsForSeller(sellerType, owner.id)
      .then((reviews) => (reviews || []).map((review) => review.toJson()));
  }
}
