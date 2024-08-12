import { BadRequestException, Controller, Delete, Get, Param } from '@nestjs/common';
import { SavedRoute } from '../saved.router';
import { SavedService } from '../service/saved.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Page } from '../../pages';
import { GetUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import { UserSignedOnly } from '../../auth/decorator/auth.decorators';
import { Product } from '../../product/models/Product.abstract';

@Controller(SavedRoute.apiController)
export class SavedApiController {
  constructor(private readonly savedService: SavedService) {}

  @Get()
  @ApiTags(Page.Saved)
  async getCart(@GetUser() user: CurrentUserType) {
    return this.savedService.getSaved(user);
  }

  @Delete(`/:id`)
  @ApiTags(Page.Saved)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  async deleteCartItem(@Param('id') productId: number, @GetUser() user: CurrentUserType) {
    if (!productId || !user?.id) {
      throw new BadRequestException('Invalid request');
    }
    await this.savedService.removeFromFavorite(productId, user);
    return this.savedService.getSaved(user);
  }
}
