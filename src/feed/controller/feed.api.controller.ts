import { BadRequestException, Controller, Delete, ForbiddenException, Get, Param, Post } from '@nestjs/common';
import { FeedRoute } from '../feed.router';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Page } from '../../pages';
import { UserSignedOnly } from '../../auth/decorator/auth.decorators';
import { FeedService } from '../service/feed.service';
import { ActionTarget, iActionTarget } from '../../user/decorator/action.target.decorator';
import { ShopService } from '../../shop/service/shop.service';
import { CurUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import { ProductCart } from '../../cart/model/ProductCart';
import { ProductSharedService } from '../../product/service/product.shared.service';
import { SuggestPriceStatus } from '../../cart/model/SuggestPriceStatus.enum';

enum NextStatus {
  Accept = 'accept',
  Decline = 'decline',
}

const statusMap = new Map<NextStatus, ProductCart['suggestedStatus']>([
  [NextStatus.Accept, SuggestPriceStatus.Accepted],
  [NextStatus.Decline, SuggestPriceStatus.Declined],
]);

@Controller(FeedRoute.apiController)
export class FeedApiController {
  constructor(
    private readonly feedService: FeedService,
    private readonly shopService: ShopService,
    private readonly productsShared: ProductSharedService,
  ) {}

  @Get()
  @ApiTags(Page.Feed)
  @UserSignedOnly()
  @ApiQuery({ name: 'shop', required: false })
  async getFeed(@ActionTarget() target: iActionTarget) {
    return this.feedService
      .getFeedForTarget(target)
      .catch((e) => {
        console.error(e);
        return [];
      })
      .then((res) => res);
  }

  @Get('/full')
  @ApiTags(Page.Feed)
  @UserSignedOnly()
  @ApiQuery({ name: 'shop', required: false })
  async getFeedOld(@ActionTarget() target: iActionTarget) {
    return this.feedService
      .getFeedForTarget(target)
      .catch((e) => {
        console.error(e);
        return [];
      })
      .then((res) => res.filter((i) => i?.type === 'suggestPrice').map((i) => i?.data));
  }

  @Delete(':id')
  @ApiTags(Page.Feed)
  @UserSignedOnly()
  @ApiParam({ name: 'id', required: true })
  async deleteFeedItem(@Param('id') id: ProductCart['id'], @CurUser() user: CurrentUserType) {
    return this.getFeedByIdIfCanEdit(id, user).then((cartItem) => {
      if (cartItem?.status === SuggestPriceStatus.Accepted) {
        throw new BadRequestException();
      }

      if (cartItem?.status === SuggestPriceStatus.Deleted) {
        return cartItem.toJson();
      }

      return this.feedService.changeStatus(cartItem, SuggestPriceStatus.Deleted).then((i) => i.toJson());
    });
  }

  @Post(':id/:status')
  @ApiTags(Page.Feed)
  @UserSignedOnly()
  @ApiParam({ name: 'id', required: true })
  @ApiParam({
    name: 'status',
    required: true,
    enum: NextStatus,
  })
  async changeStatus(
    @Param('id') id: ProductCart['id'],
    @Param('status') status: NextStatus,
    @CurUser() user: CurrentUserType,
  ) {
    return this.getFeedByIdIfCanEdit(id, user).then((cartItem) => {
      const nextStatus = statusMap.get(status);

      if (!nextStatus || cartItem?.status !== SuggestPriceStatus.Pending) {
        throw new BadRequestException();
      }

      return this.feedService.changeStatus(cartItem, nextStatus).then((i) => i.toJson());
    });
  }

  private async getFeedByIdIfCanEdit(id: number, user: CurrentUserType) {
    const cartItem = await this.feedService.getFeedItemById(id);

    if (!cartItem) {
      throw new ForbiddenException();
    }

    const product = await this.productsShared.canEditProductById(cartItem.productId, user);

    if (!product) {
      throw new ForbiddenException();
    }

    cartItem.product = product;

    return cartItem;
  }
}
