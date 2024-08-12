import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProductRoute } from '../product.router';
import { ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Page } from '../../pages';
import { ManageProductDto } from '../dto/ManageProduct.dto';
import { ProductType } from '../models/ProductType.enum';
import { ProductService } from '../service/product.service';
import { UserSignedOnly } from '../../auth/decorator/auth.decorators';
import { ActionTarget, iActionTarget } from '../../user/decorator/action.target.decorator';
import { DTO, sendFormError, validateDto } from '../../app/validation/validation.http';
import { ProductDtoValidator, updatedProductDtoValidator } from '../dto/Product.dto.validation';
import { ProductModelsByType } from '../models/ProductModelsByType';
import { CategoryService } from '../service/category.service';
import { PlansService } from '../../pricing/service/plans.service';
import { ProductAttributesDtoValidations } from '../dto/ProductAttributes.dto.validation';
import { Product } from '../models/Product.abstract';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import { ShopService } from '../../shop/service/shop.service';
import { ImageUploadService } from '../../storage/service/image-upload.service';
import { ProductImage } from '../models/ProductImage';
import { AddToCartDto } from '../../cart/dto/AddToCart.dto';
import { AddToCartDtoValidator } from '../../cart/dto/AddToCart.dto.validation';
import { CartService } from '../../cart/service/cart.service';
import { Currency } from '../../payment/model/currency.enum';
import { SavedService } from '../../saved/service/saved.service';
import { Pagination, PaginationService } from '../../catalog/service/pagination.service';
import { ProductStatus } from '../models/Product.status.enum';
import { BrandsService } from '../service/brands.service';
import { SubProductMainDtoValidator } from '../dto/SubProduct.dto.validation';
import { IsNull, Not } from 'typeorm';
import environment from '../../app/configuration/configuration.env';

@Controller(ProductRoute.apiController)
export class ProductApiController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly plansService: PlansService,
    private readonly shopService: ShopService,
    private readonly cartService: CartService,
    private readonly savedService: SavedService,
    private readonly brandsService: BrandsService,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  @Post(`/add/:type`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'type',
    enum: ProductType,
  })
  @ApiBody({
    type: ManageProductDto,
  })
  @ApiQuery({ name: 'shop', required: false })
  async add(
    @Param('type') type: ProductType,
    @Body() newProductDto: ManageProductDto,
    @ActionTarget() target: iActionTarget,
  ) {
    if (!Object.values(ProductType).includes(type)) {
      return sendFormError('type', 'Invalid product type');
    }

    const category = await this.categoryService.mainCategoryByType(type);

    if (!category?.status) {
      return sendFormError('type', 'Invalid category');
    }

    const currentPlan = await this.plansService.getCurrentPricingPlan(target);

    if (!currentPlan?.max_products) {
      return sendFormError('plan', 'Invalid plan');
    }

    const productsCount = await this.productService.countProductsByOwner(target);

    if (productsCount >= currentPlan.max_products) {
      return sendFormError('plan', 'Max products limit reached');
    }

    const productDtoValidator = updatedProductDtoValidator(type) || {
      validation: ProductDtoValidator,
    };

    const product = await this.productService.validateProduct(
      (ProductModelsByType[type] as any)
        .fromJson(validateDto(productDtoValidator.validation, newProductDto.product))
        .setOwner(target),
      category,
    );

    if (!product) {
      return sendFormError('product', 'Invalid product');
    }

    const attributesDtoValidation = ProductAttributesDtoValidations[type];

    if (!attributesDtoValidation) {
      return sendFormError('type', 'Invalid product attributes');
    }

    const attributes = await this.productService.validateProductAttributes(
      type,
      product,
      product.makeAttributes.fromJson(validateDto(attributesDtoValidation, newProductDto.attributes)),
    );

    if (!attributes) {
      return sendFormError('attributes', 'Invalid attributes');
    }

    product.status = ProductStatus.Published;
    product.quantity = 1;
    product.approved = environment.product.defaultApproved;

    return this.productService
      .save(product)
      .then((p) => (attributes.product = p))
      .then(() => this.productService.save(attributes))
      .then(() => ({
        product: product.toJson(),
        attributes: attributes.toJson(),
      }));
  }

  @Put(`/:id`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiBody({
    type: ManageProductDto,
  })
  async update(
    @Param('id') productId: number,
    @Body() newProductDto: ManageProductDto,
    @GetUser() user: CurrentUserType,
  ) {
    const _product = await this.productService.shared.canEditProductById(productId, user);

    if (!_product) {
      return sendFormError('product', 'Product not found');
    }

    return _product?.baseProductId
      ? this._updateSubProduct(_product, newProductDto)
      : this._updateBaseProduct(_product, newProductDto);
  }

  private async _updateBaseProduct(product: Product<any>, dto: ManageProductDto) {
    const category = await this.categoryService.mainCategoryByType(product.type);

    if (!category?.status) {
      return sendFormError('type', 'Invalid category');
    }

    product = await this.productService.validateProduct(
      product.fromJson(validateDto(ProductDtoValidator, dto.product)),
      category,
    );

    if (!product) {
      return sendFormError('product', 'Invalid product');
    }

    const attributesDtoValidation = ProductAttributesDtoValidations[product.type];

    if (!attributesDtoValidation) {
      return sendFormError('type', 'Invalid product attributes');
    }

    const attributes = await this.productService.validateProductAttributes(
      product.type,
      product,
      (await this.productService.getAttributes(product))?.fromJson(
        validateDto(attributesDtoValidation, dto.attributes),
      ),
    );

    if (!attributes) {
      return sendFormError('attributes', 'Invalid attributes');
    }

    return this.productService
      .save(product)
      .then(() => this.productService.save(attributes))
      .then(() => ({
        product: product.toJson(),
        attributes: attributes.toJson(),
      }));
  }

  private async _updateSubProduct(product: Product<any>, dto: ManageProductDto) {
    const baseProduct = await this.productService.getProductById(product.baseProductId);

    if (!baseProduct) {
      return sendFormError('product', 'Product not found');
    }

    product
      .fromJson(baseProduct.getBaseProductSharedData())
      .fromJson(validateDto(SubProductMainDtoValidator, dto?.product || {}));

    const attributesDtoValidation = ProductAttributesDtoValidations[product.type];

    if (!attributesDtoValidation) {
      return sendFormError('type', 'Invalid product attributes');
    }

    const attributes = await this.productService.validateProductAttributes(
      product.type,
      product,
      (await this.productService.getAttributes(product))?.fromJson(
        validateDto(attributesDtoValidation, dto.attributes),
      ),
    );

    if (!attributes) {
      return sendFormError('attributes', 'Invalid attributes');
    }

    return this.productService
      .save(product)
      .then(() => this.productService.save(attributes))
      .then(() => ({
        product: product.toJson(),
        attributes: attributes.toJson(),
      }));
  }

  @Get(`/suggest/:type`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'type',
    enum: ProductType,
  })
  @ApiQuery({ name: 'query', required: true })
  async suggestProductAttributesBySerialNumber(@Param('type') type: ProductType, @Query('query') query: string) {
    if (!Object.values(ProductType).includes(type)) {
      return sendFormError('type', 'Invalid product type');
    }

    query = (query || '')?.trim?.()?.toLowerCase();

    if (query?.length < 3) {
      return [];
    }

    return this.productService
      .suggestModel(query, type)
      .catch(() => [])
      .then((res) =>
        Promise.all(
          (res || []).map(async (r) => ({
            type: type,
            brandId: r.brandId,
            brand: (await this.brandsService.getBrand(r.brandId))?.name,
            model: r.model || '',
          })),
        ),
      );
  }

  @Get(`/suggest/:type/attributes`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'type',
    enum: ProductType,
  })
  @ApiQuery({ name: 'brandId', required: true })
  @ApiQuery({ name: 'model', required: true })
  async suggestProductAttributes(
    @Param('type') type: ProductType,
    @Query('brandId') brandId: string | number,
    @Query('model') model: string,
  ) {
    if (!Object.values(ProductType).includes(type)) {
      return sendFormError('type', 'Invalid product type');
    }

    brandId = Number(((brandId || '') as string)?.trim?.()?.toLowerCase());
    model = (model || '')?.trim?.()?.toLowerCase();

    if (!brandId || !model) {
      return [];
    }

    return this.productService.suggestAttributes(type, brandId, model).catch(() => ({}));
  }

  @Get('/list')
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiQuery({ name: 'shop', required: false })
  // @ApiQuery({ name: 'page', required: false, type: Number })
  async listProducts(
    @ActionTarget() target: iActionTarget,
    @Pagination() pagination: PaginationService,
    @GetUser() user: CurrentUserType,
  ) {
    return this.userProducts(target, pagination, user);
  }

  @Get('/list/:type')
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'type',
    enum: ProductType,
    required: true,
  })
  @ApiQuery({ name: 'shop', required: false })
  // @ApiQuery({ name: 'page', required: false, type: Number })
  async listProductsByType(
    @Param('type') type: ProductType,
    @ActionTarget() target: iActionTarget,
    @Pagination() pagination: PaginationService,
    @GetUser() user: CurrentUserType,
  ) {
    return this.userProducts(target, pagination, user, type);
  }

  private async userProducts(
    target: iActionTarget,
    pagination: PaginationService,
    user: CurrentUserType,
    type?: ProductType,
  ) {
    if (!target?.id) {
      throw new UnauthorizedException();
    }

    const condition: Record<string, any> = {
      ownerType: target.type,
      ownerId: target.id,
      status: Not(ProductStatus.Deleted),
      baseProductId: IsNull(),
    };

    if (type) {
      if (!Object.values(ProductType).includes(type)) {
        throw new BadRequestException('Invalid product type');
      }
      condition.type = type;
    }

    pagination.onPage(Infinity);

    const [products, productCount] = await this.productService.findAndCountProducts({
      where: condition,
      take: pagination.limit,
      skip: pagination.offset,
    });

    await Promise.all([this.productService.shared.attachFavorites(products, user)]);

    pagination.setCount(productCount);
    return pagination.response(products.map((p) => p.toJson()));
  }

  @Get(`/:id`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  async getProduct(@Param('id') productId: number, @GetUser() user: CurrentUserType) {
    const product = await this.productService.shared.canEditProductById(productId, user);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const attributes = await this.productService.getAttributes(product);

    return {
      product: product?.toJson(),
      attributes: attributes?.toJson(),
    };
  }

  @Get(`/:id/subproducts`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  async getSubProducts(@Param('id') productId: number, @GetUser() user: CurrentUserType) {
    const product = await this.productService.shared.canEditProductById(productId, user);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.productService.getSubProducts(product).then((products) => {
      return Promise.all(
        products.map(async (p) => {
          return {
            product: p?.toJson(),
            attributes: (await this.productService.getAttributes(p))?.toJson(),
          };
        }),
      );
    });
  }

  @Post(`/:id/subproduct`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  @ApiBody({
    type: ManageProductDto,
  })
  async addSubProduct(
    @Param('id') productId: number,
    @Body() newProductDto: ManageProductDto,
    @GetUser() user: CurrentUserType,
  ) {
    const _product = await this.productService.shared.canEditProductById(productId, user);

    if (!_product) {
      return sendFormError('product', 'Product not found');
    }

    const subProduct = _product
      ?.makeSubProduct()
      ?.fromJson(validateDto(SubProductMainDtoValidator, newProductDto?.product || {}))
      ?.setOwner(_product?.getOwner());

    const attributesDtoValidation = ProductAttributesDtoValidations[subProduct.type];

    if (!attributesDtoValidation) {
      return sendFormError('type', 'Invalid product attributes');
    }

    const attributes = await this.productService.validateProductAttributes(
      subProduct.type,
      subProduct,
      subProduct.makeAttributes.fromJson(validateDto(attributesDtoValidation, newProductDto.attributes)),
    );

    if (!attributes) {
      return sendFormError('attributes', 'Invalid attributes');
    }

    subProduct.quantity = 1;
    return this.productService
      .save(subProduct)
      .then((p) => (attributes.product = p))
      .then(() => this.productService.save(attributes))
      .then(() => ({
        product: subProduct.toJson(),
        attributes: attributes.toJson(),
      }));
  }

  @Post(`/:id/quantity`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
        },
      },
    },
  })
  async updateProductQuantity(
    @Param('id') productId: number,
    @Body() body: { quantity: number },
    @GetUser() user: CurrentUserType,
  ) {
    const product = await this.productService.shared.canEditProductById(productId, user);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const quantity = Number(body.quantity);

    if (isNaN(quantity) || quantity < 0) {
      return sendFormError('quantity', 'Invalid quantity');
    }

    if (quantity > 10000) {
      return sendFormError('quantity', 'Quantity is too big');
    }

    product.quantity = quantity;
    return this.productService.save(product).then((p) => p.toJson());
  }

  @Post(`/:id/status`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'number',
        },
      },
    },
  })
  async updateProductStatus(
    @Param('id') productId: number,
    @Body() body: { status: ProductStatus },
    @GetUser() user: CurrentUserType,
  ) {
    const product = await this.productService.shared.canEditProductById(productId, user);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const status = Number(body.status);

    if (![ProductStatus.Hidden, ProductStatus.Published].includes(status)) {
      return sendFormError('status', 'Invalid status');
    }

    product.status = status;

    await this.productService.save(product);

    const subProducts = await this.productService.getSubProducts(product);

    return Promise.all(
      subProducts.map(async (subProduct) => {
        subProduct.status = status;
        return this.productService.save(subProduct);
      }),
    ).then(() => product.toJson());
  }

  @Post(`/:id/image`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async attachImageToProduct(
    @Param('id') productId: number,
    @GetUser() user: CurrentUserType,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const product = await this.productService.shared.canEditProductById(productId, user);

    if (!product) {
      return sendFormError('product', 'Invalid product');
    }

    const currentPlan = await this.plansService.getCurrentPricingPlan({
      id: product.ownerId,
      type: product.ownerType,
    });

    if ((product.images?.length || 0) >= (currentPlan.max_product_images || 0)) {
      return sendFormError('plan', 'Max product images limit reached');
    }

    return (
      product &&
      this.imageUploadService
        .uploadProductImage(file)
        .then((file: ProductImage) => {
          product.images = product.images || [];
          product.images.push(file);
        })
        .then(() => this.productService.save(product))
        .then((p) => p.toJson())
    );
  }

  @Post(`/:id/cover`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        imageId: {
          type: 'string',
        },
      },
    },
  })
  async setProductCoverImage(
    @Param('id') productId: number,
    @GetUser() user: CurrentUserType,
    @Body() body: { imageId: string },
  ) {
    const product = await this.productService.shared.canEditProductById(productId, user);

    if (!product) {
      return sendFormError('product', 'Invalid product');
    }

    if (!body.imageId?.length) {
      return sendFormError('imageId', 'Invalid image');
    }

    const cover = product.images?.find((image) => image.id === body.imageId);

    if (!cover) {
      return sendFormError('imageId', 'Invalid image');
    }

    product.cover = cover?.id;
    return this.productService.save(product).then((p) => p.toJson());
  }

  @Delete(`/:id/image/:imageId`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  @ApiParam({
    name: 'imageId',
    type: Product['cover'],
  })
  async deleteProductImage(
    @Param('id') productId: number,
    @GetUser() user: CurrentUserType,
    @Param('imageId') imageId: string,
  ) {
    const product = await this.productService.shared.canEditProductById(productId, user);

    if (!product) {
      return sendFormError('product', 'Invalid product');
    }

    product.images = (product.images || [])?.filter((image) => image.id !== imageId);

    if (product.cover === imageId) {
      product.cover = null;
    }

    return this.productService.save(product).then((p) => p.toJson());
  }

  @Delete(`/:id`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  async deleteProduct(@Param('id') productId: number, @GetUser() user: CurrentUserType) {
    const product = await this.productService.shared.canEditProductById(productId, user);

    if (!product) {
      return sendFormError('product', 'Invalid product');
    }

    return this.productService
      .deleteProduct(product)
      .then(() => true)
      .catch(() => false);
  }

  @Post(`/:id/favorite`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  async favoriteProduct(@Param('id') productId: number, @GetUser() user: CurrentUserType) {
    if (!productId || !user?.id) {
      throw new BadRequestException();
    }

    const product = await this.productService.getProductById(productId);

    if (!product) {
      return sendFormError('product', 'Invalid product');
    }

    return this.savedService
      .addToFavorite(product, user)
      .catch(() => false)
      .then((res) => !!res)
      .then((status) => this.favoriteStatus(status, user));
  }

  @Delete(`/:id/favorite`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  async removeFromFavorites(@Param('id') productId: number, @GetUser() user: CurrentUserType) {
    if (!productId || !user?.id) {
      throw new BadRequestException('Invalid request');
    }
    await this.savedService.removeFromFavorite(productId, user);
    return this.favoriteStatus(false, user);
  }

  @Post(`/:id/cart`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  @ApiBody({
    type: AddToCartDto,
    required: false,
  })
  async addToCart(
    @Param('id') productId: number,
    @DTO(AddToCartDtoValidator) addToCartDto: AddToCartDto,
    @GetUser() user: CurrentUserType,
  ) {
    if (!productId || !user?.id) {
      throw new BadRequestException();
    }

    const product = await this.productService.getProductById(productId);

    if (!product) {
      return sendFormError('product', 'Invalid product');
    }

    const productInCart = await this.cartService.getOrCreate(product, user);
    productInCart.quantity = Math.min(product.quantity, Math.max(addToCartDto.quantity || 1, 1));

    if (addToCartDto?.price) {
      productInCart.suggestedPrice = addToCartDto.price;
      productInCart.suggestedPriceCurrency = addToCartDto.currency || Currency.USD;
    }

    return this.cartService
      .save(productInCart)
      .catch(() => false)
      .then((res) => !!res)
      .then((status) => this.cartStatus(status, user));
  }

  @Delete(`/:id/cart`)
  @ApiTags(Page.ManageProduct)
  @UserSignedOnly()
  @ApiParam({
    name: 'id',
    type: Product['id'],
  })
  async removeFromCart(@Param('id') productId: number, @GetUser() user: CurrentUserType) {
    if (!productId || !user?.id) {
      throw new BadRequestException('Invalid request');
    }
    await this.cartService.removeByProductId(productId, user);
    return this.cartStatus(false, user);
  }

  private async cartStatus(status: boolean, user: CurrentUserType) {
    return {
      active: status,
      count: await this.cartService.getCartItemsCount(user),
    };
  }

  private async favoriteStatus(status: boolean, user: CurrentUserType) {
    return {
      active: status,
      count: await this.savedService.getFavoritesCount(user),
    };
  }
}
