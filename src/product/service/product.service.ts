import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { EntityManager, In, IsNull, Not, SelectQueryBuilder } from 'typeorm';
import { Model } from '../../app/models/entity-helper';
import { Product } from '../models/Product.abstract';
import { BrandsService } from './brands.service';
import { sendValidationError } from '../../app/validation/validation.http';
import { Category } from '../models/category.entity';
import { iActionTarget } from '../../user/decorator/action.target.decorator';
import { ProductAttributesService } from './product-attributes.service';
import { ProductType } from '../models/ProductType.enum';
import { ProductFilter } from '../../catalog/models/filter/product.filter';
import { ProductModelsByType } from '../models/ProductModelsByType';
import { PlanHistory } from '../../pricing/models/PlanHistory';
import { PlanStatus } from '../../pricing/models/PlanStatus.enum';
import { FilterMultiSelect, FilterRange, FilterSwitch, FilterType } from '../../catalog/models/filter/filter.type';
import { PaginationService } from '../../catalog/service/pagination.service';
import { ProductSorting } from '../../catalog/models/product.sorting.enum';
import { LanguageCode } from '../../app/language/translation.provider';
import { ProductSharedService } from './product.shared.service';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { ProductStatus } from '../models/Product.status.enum';
import { ProductOwner } from '../models/Product.owner.enum';
import { ProductOwnerModelByType } from '../models/ProductOwnerModelByType';
import { User } from '../../user/models/User';
import { Shop } from '../../shop/models/Shop';
import { ProductAttributesDtoValidations } from '../dto/ProductAttributes.dto.validation';
import { ProductDtoValidator } from '../dto/Product.dto.validation';

const canSuggest = Symbol('canSuggestProperty');

@Injectable()
export class ProductService {
  constructor(
    @InjectEntityManager(Database.Main) private entityManager: EntityManager,
    protected readonly brandsService: BrandsService,
    protected readonly productAttributesService: ProductAttributesService,
    public readonly shared: ProductSharedService,
  ) {}

  async findOneProduct(where?): Promise<Product<any>> {
    const product = await this.entityManager.findOne(Product, {
      where,
      loadRelationIds: false,
      loadEagerRelations: false,
      relationLoadStrategy: 'query',
    });

    if (product) {
      product.attributes = await this.getAttributes(product);
    }

    return product;
  }

  async findAndCountProducts(options: FindManyOptions<Product<any>>) {
    return this.entityManager.findAndCount(Product, options);
  }

  async getProductById(id: number) {
    return await this.shared.getProductById(id);
  }

  async getActiveProductUrls() {
    return this.entityManager.find(Product, {
      where: {
        status: ProductStatus.Published,
        approved: true,
        baseProductId: IsNull(),
      },
      select: {
        url: true,
      },
    });
  }

  async getActiveSellerUrls() {
    const allSellers =
      (await this.entityManager
        .getRepository(Product)
        .createQueryBuilder('product')
        .select(['product.ownerType', 'product.ownerId'])
        .where('product.status = :status', { status: ProductStatus.Published })
        .andWhere('product.approved = :approved', { approved: true })
        .andWhere('product.baseProductId IS NULL')
        .groupBy(`product.ownerType, product.ownerId`)
        .getRawMany()
        .catch(() => [])) || [];

    const byType = allSellers.reduce((a, c) => {
      const list = a.get(c.product_ownerType) || [];
      list.push(c.product_ownerId);
      a.set(c.product_ownerType, list);
      return a;
    }, new Map());

    const getInfo = (repo, ids) => {
      return (
        !ids?.length
          ? Promise.resolve([])
          : repo.find({
              where: {
                id: In(ids || []),
              },
              select: {
                url: true,
                uuid: true,
              },
            })
      ).then((res) => res.map((i) => `/${i.type === ProductOwner.User ? 'user' : 'shop'}/${i.url || i.uuid}`));
    };

    return await Promise.all([
      getInfo(this.entityManager.getRepository(User), byType.get(ProductOwner.User)),
      getInfo(this.entityManager.getRepository(Shop), byType.get(ProductOwner.Shop)),
    ]).then((res) => [...res]);
  }

  async getAttributes(product: Product<any>): Promise<Model> {
    return this.entityManager.findOne(product.makeAttributes, {
      loadRelationIds: false,
      loadEagerRelations: false,
      relationLoadStrategy: 'query',
      where: {
        product: {
          id: product.id,
        },
      },
    }) as unknown as Model;
  }

  async save<Entity extends Model>(product: Entity) {
    return this.entityManager.save<Entity>(product);
  }

  async validateProduct(product: any, category: Category): Promise<Product<any>> {
    product.brandId = await this.validateBrand(product.brandId, category.id);
    return product as Product<any>;
  }

  private async validateBrand(brandId: number, categoryId: number) {
    const brand = await this.brandsService.getBrandByIdInCategory(brandId, categoryId);
    if (!brand) {
      return sendValidationError('brandId', 'Brand not found');
    }
    return brand?.id;
  }

  async validateProductAttributes<T extends Model>(
    type: ProductType,
    product: Product<any>,
    attributes: T,
  ): Promise<T> {
    const available = await this.productAttributesService.getProductAttributesValuesByProductType(type);

    Object.entries(attributes).forEach(([key, value]) => {
      if (value && available[key] && !available[key]?.includes(value)) {
        sendValidationError(key, `Attribute ${key} has invalid value`);
      }
    });

    return attributes;
  }

  async countProductsByOwner(target: iActionTarget) {
    return this.entityManager.count(Product, {
      where: {
        ownerId: target.id as number,
        ownerType: target.type,
      },
    });
  }

  private addSearch(query: string, queryBuilder: SelectQueryBuilder<Product<any>>) {
    if (query?.length > 2) {
      return queryBuilder.andWhere(
        'MATCH(product.title, product.model, product.serialNumber, product.referenceNumber) AGAINST(:searchQuery IN BOOLEAN MODE)',
        {
          searchQuery: `${query}*`,
        },
      );
    }
    return queryBuilder;
  }

  async suggestModel(query: string, productType?: ProductType) {
    let products = this.entityManager
      .getRepository(Product)
      .createQueryBuilder('product')
      .select('brandId, model')
      .distinct(true)
      .andWhere('product.type = :type', { type: productType });
    products = this.addSearch(query, products).groupBy('`product`.`brandId`, `product`.`model`').limit(10);
    return products.getRawMany();
  }

  async searchProducts(
    query: string,
    productType?: ProductType,
    target?: iActionTarget,
    withCategories = true,
  ): Promise<{
    products: Product<any>[];
    categories: { type: ProductType; count: number }[];
  }> {
    query = query?.trim?.()?.toLowerCase() || '';
    if (query?.length < 3) {
      return { products: [], categories: [] };
    }

    let products = this.entityManager
      .getRepository(Product)
      .createQueryBuilder('product')
      .distinct(true)
      .where('product.status = :status', { status: this.shared.productShowStatus });

    products = this.addSearch(query, products);

    if (target) {
      products = products.andWhere('product.ownerId = :ownerId AND product.ownerType = :ownerType', {
        ownerId: target.id,
        ownerType: target.type,
      });
    }

    products = products.limit(10);

    return products
      .getMany()
      .then(async (list) => {
        const response = {
          products: list,
          categories: [] as { type: ProductType; count: number }[],
        };

        if (withCategories && !productType && list.length) {
          response['categories'] = await products
            .select('product.type as type, COUNT(product.id) as count')
            .groupBy('product.type')
            .orderBy('count', 'DESC')
            .getRawMany()
            .catch(() => []);
        }

        return response;
      })
      .catch(() => ({ products: [], categories: [] }));
  }

  async getProductsByFilter(
    filter: ProductFilter,
    pagination: PaginationService,
    sorting: ProductSorting,
    searchQuery = '',
    productType?: ProductType,
    target?: iActionTarget,
  ) {
    const availableProductFilters = (filter.getGeneralProductFilters() || []).map((filter) => filter.key);
    const activeFilters = filter.activeFilters();
    const productFilters = Object.keys(activeFilters).filter((key) => availableProductFilters.includes(key));
    const attributesFilters = Object.keys(activeFilters).filter((key) => !availableProductFilters.includes(key));

    const Entity = (productType && ProductModelsByType[productType]) || Product;

    const needAttributes =
      productType && attributesFilters?.length && ProductModelsByType[productType]?.attributesEntity;

    const attributesTable =
      needAttributes &&
      this.entityManager.getRepository(ProductModelsByType[productType]?.attributesEntity).metadata.givenTableName;

    const planHistoryTable = this.entityManager.getRepository(PlanHistory).metadata.givenTableName;

    let products = this.entityManager
      .getRepository(Entity)
      .createQueryBuilder('product')
      .distinct(true)
      .innerJoin(
        planHistoryTable,
        'plan',
        'plan.type = product.ownerType AND plan.foreignId = product.ownerId AND plan.status = :status AND plan.until > NOW()',
        { status: PlanStatus.Enabled },
      );

    if (attributesTable) {
      products = products.innerJoin(attributesTable, 'attributes', 'attributes.productId = product.id');
    }

    products = products.where('product.status = :status', { status: this.shared.productShowStatus });

    if (productType) {
      products = products.andWhere('product.type = :type', { type: productType });
    }

    searchQuery = searchQuery?.replace(/-/g, '')?.replace(/\s\s+/g, ' ')?.trim();

    if (searchQuery?.length) {
      products = this.addSearch(searchQuery, products);
    }

    if (target) {
      products = products.andWhere('product.ownerId = :ownerId AND product.ownerType = :ownerType', {
        ownerId: target.id,
        ownerType: target.type,
      });
    }

    Object.entries(activeFilters || {}).forEach(([key, value]) => {
      const isProductFilter = productFilters.includes(key);
      if (isProductFilter || attributesTable) {
        products = this.attachFiltersToQuery(products, key, value, isProductFilter ? 'product' : 'attributes');
      }
    });

    switch (sorting) {
      case ProductSorting.PriceExpensive:
        products = products.orderBy('product.price', 'DESC');
        break;
      case ProductSorting.PriceCheap:
        products = products.orderBy('product.price', 'ASC');
        break;
      case ProductSorting.Rating:
        products = products.orderBy('product.rating', 'DESC');
        break;
    }

    products = products.offset(pagination.offset).limit(pagination.limit);

    return products.getManyAndCount();
  }

  private attachFiltersToQuery(
    query: SelectQueryBuilder<Product<any>>,
    filter: string,
    filterInfo: FilterType,
    alias: string,
  ) {
    const column = filterInfo?.colId || filter;
    const value = filterInfo?.collectInfo();

    if (filterInfo instanceof FilterMultiSelect) {
      return query.andWhere(`${alias}.${column} IN (:...${column})`, {
        [column]: value,
      });
    } else if (filterInfo instanceof FilterRange) {
      return query.andWhere(`${alias}.${column} BETWEEN :${column}Min AND :${column}Max`, {
        [`${column}Min`]: value.min,
        [`${column}Max`]: value.max,
      });
    } else if (filterInfo instanceof FilterSwitch) {
      if (filterInfo.asNotNull) {
        return query.andWhere(`${alias}.${column} IS NOT NULL`);
      } else {
        return query.andWhere(`${alias}.${column} = true`);
      }
    } else {
      console.error(`Filter ${filter} is not supported`);
    }

    return query;
  }

  async attachAttributes(showProduct: Product<any>, lang: LanguageCode) {
    if (showProduct?.id && showProduct.type) {
      const attributes = await this.productAttributesService.getProductAttributesByProductType(showProduct.type);
      Object.entries(showProduct.attributes || {}).forEach(([key, value]) => {
        const options = attributes[key];
        if (options?.length) {
          const selectedOption = options.find((o) => o.value === value);
          showProduct.attributes[key] = selectedOption?.setLanguage(lang) || selectedOption || value;
        }
      });
    }
    return showProduct;
  }

  async getAllAttributes(productType: ProductType) {
    const attributes = await this.productAttributesService.getProductAttributesByProductType(productType);
    return Object.entries(attributes || {}).reduce((acc, [attr, options]) => {
      acc[attr] = (options || []).reduce((accAttr, option) => {
        accAttr[option.value] = option;
        return accAttr;
      }, {});
      return acc;
    }, {});
  }

  async getBrand(showProduct: Product<any>) {
    if (showProduct?.brandId) {
      return this.brandsService.getBrand(showProduct.brandId);
    }
  }

  async deleteProduct(product: Product<any>) {
    product.status = ProductStatus.Deleted;
    return this.entityManager.save(product);
  }

  async findOwnerByUuidOrUrl(type: ProductOwner, uuid: string): Promise<User | Shop> {
    const ownerModel = ProductOwnerModelByType[type];
    if (!ownerModel) {
      return null;
    }
    return this.entityManager
      .createQueryBuilder(ownerModel, 'owner')
      .where('owner.uuid = :uuid OR owner.url = :url', { uuid, url: uuid })
      .getOne();
  }

  async suggestAttributes(type: ProductType, brandId: number, model: string) {
    const dto = ProductAttributesDtoValidations[type];
    if (!dto) {
      return null;
    }

    const productSuggestInfo: Partial<Record<keyof typeof ProductDtoValidator.fields, any>> = {
      brandId: brandId,
      model: model,
      price: 0,
      sex: canSuggest,
      year: canSuggest,
    };

    const priceSuggest = this.entityManager
      .getRepository(Product)
      .createQueryBuilder('product')
      .select('AVG(product.price)', 'price')
      .where('product.type = :type', { type })
      .andWhere('product.brandId = :brandId', { brandId })
      .andWhere('product.model = :model', { model });

    return Promise.all([
      priceSuggest
        .getRawOne()
        .catch(() => ({ price: 0 }))
        .then((p) => (productSuggestInfo.price = Number(p?.price) || 0)),
      this.suggestProductInfo(
        Object.keys(productSuggestInfo).filter((f) => productSuggestInfo[f] === canSuggest),
        type,
        brandId,
        model,
      ),
      this.suggestProductAttributesInfo(Object.keys(dto.fields), type, brandId, model),
    ])
      .catch(() => [{}, {}])
      .then(([price, product, attributes]) => ({
        product: Object.assign(
          {
            brandId: productSuggestInfo.brandId,
            model: productSuggestInfo.model,
            price: price || productSuggestInfo.price,
          },
          product || {},
        ),
        attributes: attributes || {},
      }));
  }

  private async suggestProductInfo(fields: string[], type: ProductType, brandId: number, model: string) {
    const alias = 'product';
    return this.suggestFields(
      fields,
      alias,
      this.entityManager
        .getRepository(Product)
        .createQueryBuilder(alias)
        .where(`${alias}.type = :type`, { type })
        .andWhere(`${alias}.brandId = :brandId`, { brandId })
        .andWhere(`${alias}.model = :model`, { model }),
    );
  }

  private async suggestProductAttributesInfo(fields: string[], type: ProductType, brandId: number, model: string) {
    const entity = ProductModelsByType[type]?.attributesEntity;

    if (!entity) {
      return {};
    }

    const productTable = this.entityManager.getRepository(Product).metadata.givenTableName;
    return this.suggestFields(
      fields,
      'attributes',
      this.entityManager
        .getRepository(entity)
        .createQueryBuilder('attributes')
        .innerJoin(
          productTable,
          'product',
          'product.id = attributes.productId and product.type = :type and product.brandId = :brandId and product.model = :model',
          {
            type,
            brandId,
            model,
          },
        ),
    );
  }

  private async suggestFields(fields: string[], alias: string, query: SelectQueryBuilder<any>) {
    return Promise.all(
      fields.map(async (f) => {
        const q = query
          .clone()
          .select(`${alias}.${f}`, f)
          .distinct()
          .addSelect(`COUNT(${alias}.${f})`, 'count')
          .groupBy(f)
          .orderBy('count', 'DESC')
          .limit(1);

        return { [f]: (await q.getRawOne())?.[f] };
      }),
    )
      .catch(() => [])
      .then((res) => Object.assign({}, ...res));
  }

  async getSubProducts(product: Product<any>) {
    return this.entityManager.getRepository(Product).find({
      where: {
        baseProductId: product.id,
        status: Not(ProductStatus.Deleted),
      },
    });
  }

  async getProductsByIds(ids: number[], where?) {
    return this.entityManager.getRepository(Product).find({
      where: {
        id: In(ids),
        ...(where || {}),
      },
    });
  }

  async getProductsAttributesByIds(ids: number[], type: ProductType) {
    return this.entityManager.getRepository(ProductModelsByType[type]?.attributesEntity).find({
      where: {
        productId: In(ids),
      },
    });
  }

  async getProductsByIdsWithAttributes(ids: number[], type: ProductType) {
    return Promise.all([
      this.getProductsByIds(ids),
      this.getProductsAttributesByIds(ids, type).then((res) =>
        (res || []).reduce((a, c) => {
          a[c.productId] = c;
          return a;
        }, {}),
      ),
    ]).then(([products, attributes]) => {
      return products.map((p) => {
        p.attributes = attributes[p.id];
        return p;
      });
    });
  }

  async getProductVariantsAttributes(baseProductId: number, type: ProductType) {
    return this.getProductsByIdsWithAttributes(
      Array.from(
        new Set([
          baseProductId,
          ...(
            (await this.entityManager.getRepository(Product).find({
              select: ['id'],
              where: [
                {
                  baseProductId,
                },
              ],
            })) || []
          ).map((p) => p.id),
        ]),
      ),
      type,
    );
  }

  getPopularProducts(limit: number) {
    return this.entityManager
      .getRepository(Product)
      .find({
        where: {
          status: ProductStatus.Published,
        },
        order: {
          id: 'DESC',
        },
        take: limit,
      })
      .then((res) =>
        Promise.all(
          (res || []).map((p) =>
            this.getAttributes(p).then((a) => {
              p.attributes = a;
              return p;
            }),
          ),
        ),
      );
  }
}
