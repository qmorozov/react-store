import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ShopRoute } from '../shop.router';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Page } from '../../pages';
import { GetUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import { CreateShopDto } from '../dto/createShop.dto';
import { CreateShopDtoValidation } from '../dto/createShop.dto.validation';
import { DTO, sendFormError } from '../../app/validation/validation.http';
import { ShopService } from '../service/shop.service';
import { UsersService } from '../../user/service/users.service';
import { PlansService } from '../../pricing/service/plans.service';
import { UserSignedOnly } from '../../auth/decorator/auth.decorators';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import { Shop } from '../models/Shop';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageUploadService } from '../../storage/service/image-upload.service';
import { AuthService } from '../../auth/service/auth.service';
import { AppRequest, AppResponse } from '../../app/models/request';
import { User } from '../../user/models/User';

@Controller(ShopRoute.apiController)
@ApiTags(Page.Shop)
export class ShopApiController {
  constructor(
    private readonly shopService: ShopService,
    private readonly userService: UsersService,
    private readonly plansService: PlansService,
    private readonly imageUploadService: ImageUploadService,
    private readonly authService: AuthService,
  ) {}

  @Get('list')
  async getUserShops(@GetUser() user: CurrentUserType) {
    return this.shopService.userShops(user.id).then((shops) => shops.map((shop) => shop.toJson()));
  }

  @Get()
  async getActiveShop(@GetUser() user: CurrentUserType) {
    return this.shopService.userShop(user.id).then((shop) => shop?.toJson());
  }

  @Get(':uuid')
  async getShop(@Param('uuid') shopUuid: string) {
    return this.shopService.getShopByUUID(shopUuid).then((shop) => shop?.toJson());
  }

  @Post()
  @ApiBody({ type: CreateShopDto })
  @UserSignedOnly()
  async createShop(
    @DTO(CreateShopDtoValidation) createShopDto: CreateShopDto,
    @GetUser() user: CurrentUserType | User,
    @Req() req: AppRequest,
    @Res() res: AppResponse,
  ) {
    user = await this.userService.getUser(user.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentPlan = await this.plansService.getCurrentPricingPlan({
      id: user.id,
      type: ProductOwner.User,
    });

    const userShops = await this.shopService.userShops(user.id, currentPlan?.max_shops);

    if (userShops.length >= currentPlan.max_shops) {
      return sendFormError(
        'plan_max_shops',
        'You have reached the maximum number of shops for your plan. Please upgrade your plan to add more shops.',
      );
    }

    const shop = await this.shopService.createShop(Shop.fromJson(createShopDto), user.id);

    return this.authService.makeSessionAndSend(shop?.toJson(), user as User, req, res);
  }

  @Put(':uuid')
  @ApiBody({ type: CreateShopDto })
  @UserSignedOnly()
  async updateShop(
    @Param('uuid') shopUuid: string,
    @DTO(CreateShopDtoValidation) editShopDto: CreateShopDto,
    @GetUser() user: CurrentUserType | User,
    @Req() req: AppRequest,
    @Res() res: AppResponse,
  ) {
    user = await this.userService.getUser(user.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const shop = await this.canEditShop(user.id, shopUuid);

    if (shop) {
      shop.fromJson(editShopDto);
      await this.shopService.save(shop);
      return this.authService.makeSessionAndSend(shop?.toJson(), user, req, res);
    }
  }

  @Delete(':uuid')
  @UserSignedOnly()
  async deleteShop(
    @Param('uuid') shopUuid: string,
    @GetUser() user: CurrentUserType | User,
    @Req() req: AppRequest,
    @Res() res: AppResponse,
  ) {
    user = await this.userService.getUser(user.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const shop = await this.canEditShop(user.id, shopUuid);

    return (
      shop &&
      this.shopService
        .delete(shop)
        .then(() => this.authService.makeSessionAndSend(true, user as User, req, res))
        .catch(() => false)
    );
  }

  @Post(':uuid/logo')
  @UserSignedOnly()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(
    @Param('uuid') shopUuid: string,
    @GetUser() user: CurrentUserType | User,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AppRequest,
    @Res() res: AppResponse,
  ) {
    user = await this.userService.getUser(user.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const shop = await this.canEditShop(user.id, shopUuid);
    return (
      shop &&
      this.imageUploadService
        .uploadShopLogo(file)
        .then((url) => (shop.image = url))
        .then(() => this.shopService.save(shop))
        .then((shop) => shop.toJson())
        .then((shop) => {
          return this.authService.makeSessionAndSend(shop, user as User, req, res);
        })
    );
  }

  @Delete(':uuid/logo')
  @UserSignedOnly()
  async deleteLogo(
    @Param('uuid') shopUuid: string,
    @GetUser() user: CurrentUserType | User,
    @Req() req: AppRequest,
    @Res() res: AppResponse,
  ) {
    user = await this.userService.getUser(user.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const shop = await this.canEditShop(user.id, shopUuid);
    shop.image = null;
    return this.shopService.save(shop).then((shop) => {
      return this.authService.makeSessionAndSend(shop?.toJson(), user as User, req, res);
    });
  }

  private async canEditShop(userId: number, shopUuid: string): Promise<Shop | undefined> {
    const shop = await this.shopService.getShopByUUID(shopUuid);

    if (!shop) {
      sendFormError('not_found', 'Shop not found.');
      return undefined;
    }

    const userCanEdit = shop && (await this.shopService.canEditShop(userId, shop.id));

    if (!userCanEdit) {
      sendFormError('access', 'You dont have access to edit this shop.');
      return undefined;
    }

    return shop;
  }
}
