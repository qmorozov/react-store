import { Controller, Get, NotFoundException, Param, Req, Res } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import ProductPage from '../view/ProductPage';
import { ManageProductRoute, ProductRoute } from '../product.router';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { ProductService } from '../service/product.service';
import { UserSignedOnly } from '../../auth/decorator/auth.decorators';
import { CategoryService } from '../service/category.service';
import { Translation } from '../../app/language/language.decorator';
import { LanguageCode } from '../../app/language/translation.provider';
import { GetUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import { ProductOwner } from '../models/Product.owner.enum';
import { ShopService } from '../../shop/service/shop.service';
import { getFilterByProductType } from '../../catalog/models/product.filters.enum';
import { Product } from '../models/Product.abstract';
import { ProductType } from '../models/ProductType.enum';
import { AppRequest, AppResponse } from '../../app/models/request';
import { TranslationProviderServer } from '../../translation/translation.provider.server';
import environment from '../../app/configuration/configuration.env';
import { ProductAttributeView } from '../models/ProductAttribute.view';

@Controller(ProductRoute.controller)
export class ProductController {
  constructor(
    private readonly renderService: RenderService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly shopService: ShopService,
  ) {}

  @Get([ManageProductRoute.path, `${ManageProductRoute.path}/:id`])
  @ApiTags(ApiType.Pages, Page.ManageProduct)
  @UserSignedOnly()
  addView(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.ManageProduct);
  }

  @Get(':url')
  @ApiTags(ApiType.Pages, Page.Catalog)
  async view(
    @Res() response: AppResponse,
    @Param('url') url: string,
    @Translation() translation: TranslationProviderServer,
    @GetUser() user: CurrentUserType,
    @Req() request: AppRequest,
  ) {
    const showProduct = await this.productService.findOneProduct({
      url: url,
    });

    if (!showProduct) {
      throw new NotFoundException();
    }

    let isProductOwner = false;

    if (!showProduct.status) {
      if (!!user?.id) {
        isProductOwner = showProduct.ownerType === ProductOwner.User && showProduct.ownerId === user?.id;
        if (!isProductOwner && showProduct.ownerType === ProductOwner.Shop) {
          isProductOwner = await this.shopService.canEditShop(user.id, showProduct.ownerId);
        }
      }

      if (!isProductOwner) {
        throw new NotFoundException();
      }
    }

    const category = await this.categoryService.mainCategoryByType(showProduct.type);

    if (!category?.status) {
      throw new NotFoundException();
    }

    category.setLanguage(translation.language);

    await Promise.all([
      this.productService.shared.isFavorite(showProduct, user).then((r) => (showProduct.$isFavorite = r)),
      this.productService.shared.isOnCart(showProduct, user).then((r) => (showProduct.$onCart = r)),
      this.productService.shared.ownerInfo(showProduct.getOwner()).then((r) => (showProduct.$owner = r)),
      this.productService.getBrand(showProduct).then((r) => (showProduct.$brand = r)),
    ]);

    const productVariants = await this.getProductVariants(showProduct, translation.language);

    await this.productService.attachAttributes(showProduct, translation.language).then(() => {
      return this.prepareAttributes(showProduct);
    });

    const productUrl = new URL(translation.link(`/product/${showProduct?.url}`), environment.href);

    return this.renderService
      .build(Page.Product)
      .document({
        title: showProduct?.title,
      })
      .og({
        'og:title': showProduct?.title,
        'og:description': showProduct?.description,
        'og:image': showProduct?.images?.[0]?.medium,
        'og:url': productUrl,
        'og:site_name': 'qmorozov',
        'og:article:author': showProduct?.$owner.name,
        'og:price:amount': showProduct?.price,
        'og:price:currency': showProduct?.currency,
      })
      .from(ProductPage, showProduct, category, productVariants)
      .render(response);
  }

  private getAttributeNames(type: ProductType) {
    return (getFilterByProductType(type, '')?.getFilterInfo() || []).reduce((a, c) => {
      a[c.key] = c.title;
      return a;
    }, {});
  }

  private async prepareAttributes(showProduct) {
    const attributeNames = this.getAttributeNames(showProduct.type);
    return (showProduct.attributes = (Object.entries(showProduct.attributes || {}) || []).reduce(
      (acc, [key, attribute]) => {
        if (!['id', 'productId'].includes(key)) {
          acc[key] = new ProductAttributeView(key, attribute, attributeNames[key]);
        }
        return acc;
      },
      {},
    ));
  }

  private async getProductVariants(product: Product<any>, lang: LanguageCode) {
    const baseProductId = product?.baseProductId || product?.id;

    const productVariantsAttributes: Product<any>[] =
      (await this.productService.getProductVariantsAttributes(baseProductId, product.type).catch(() => [])) || [];

    const productById = productVariantsAttributes.reduce((acc, variant) => {
      acc[variant.id] = variant;
      return acc;
    }, {});

    const uniqAttributes = Object.entries(
      productVariantsAttributes.reduce((acc, variant) => {
        Object.entries(variant?.attributes || {}).forEach(([key, value]) => {
          if (!acc?.[key]) {
            acc[key] = new Set();
          }
          return acc[key].add(value);
        });
        return acc;
      }, {}),
    ).reduce((acc, [key, value]) => {
      if (key && key !== 'id' && key !== 'productId' && (value as Set<string>).size > 1) {
        acc[key] = Array.from(value as Set<string>).sort();
      }
      return acc;
    }, {});

    const attributesByUniqAttribute = productVariantsAttributes.reduce((acc, variant) => {
      Object.keys(uniqAttributes).forEach((key) => {
        acc[key] = acc[key] || new Map();
        const list: Map<any, any> = acc[key].get(variant?.attributes?.[key]) || new Map();
        list.set(variant.id, variant);
        acc[key].set(variant?.attributes?.[key], list);
      });
      return acc;
    }, {});

    function getAttributeVariantsIds(attribute: string, variant) {
      return Array.from((attributesByUniqAttribute[attribute]?.get(variant) as Map<any, any>)?.keys() || []);
    }

    const currentProductVariantsIds = Object.keys(uniqAttributes).reduce((acc, attribute) => {
      acc[attribute] = getAttributeVariantsIds(attribute, product.attributes[attribute]);
      return acc;
    }, []);

    const attributeNames = this.getAttributeNames(product.type);

    const attributeOptions = await this.productService.getAllAttributes(product.type);

    return Object.entries(uniqAttributes).map(([attribute, variants]) => {
      const res: Record<string, any> = {
        attribute,
        title: attributeNames[attribute],
        variants: ((variants || []) as string[]).map((v) => {
          const availableProducts = getAttributeVariantsIds(attribute, v);
          const link =
            availableProducts?.length < 2
              ? availableProducts[0]
              : availableProducts
                  .map((p) => {
                    return {
                      product: p,
                      score: Object.entries(currentProductVariantsIds).reduce((ss, [sa, s]) => {
                        if (sa !== attribute) {
                          return s.includes(p) ? ss + 1 : ss;
                        }
                        return ss;
                      }, 0),
                    };
                  })
                  .sort((a, b) => b.score - a.score)?.[0]?.product;

          return {
            id: v,
            current: product?.attributes?.[attribute] === v,
            link: link && productById?.[link] ? `/product/${productById?.[link]?.url}` : null,
            name: attributeOptions?.[attribute]?.[v]?.setLanguage(lang)?.name ?? v,
          };
        }),
      };
      return res;
    });
  }
}
