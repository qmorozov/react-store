import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { In, Repository } from 'typeorm';
import { Brand } from '../models/brand.entity';
import { BrandToCategory } from '../models/brand-to-category.entity';
import { ImageUploadService } from '../../storage/service/image-upload.service';
import { ArrayLinked } from '../../app/services/server.helper';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import environment from '../../app/configuration/configuration.env';

@Injectable()
export class BrandsService {
  private readonly CacheKey = {
    Brands: 'brands',
    BrandsByCategories: 'brandsByCategories',
    BrandsForMainPage: 'brandsForMainPage',
  } as const;

  constructor(
    @InjectRepository(Brand, Database.Main) private brandRepository: Repository<Brand>,
    @InjectRepository(BrandToCategory, Database.Main) private brandToCategoryRepository: Repository<BrandToCategory>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly imageUpload: ImageUploadService,
  ) {}

  async getBrandsFromRepository() {
    return this.brandRepository.find().catch(() => [] as Brand[]);
  }

  async getBrands() {
    return this.cacheManager.wrap(
      this.CacheKey.Brands,
      () => this.getBrandsFromRepository().then((b) => new ArrayLinked<Brand>('id', b)),
      environment.cache.long,
    );
  }

  private async getBrandsByCategories() {
    return this.cacheManager.wrap(
      this.CacheKey.BrandsByCategories,
      () =>
        Promise.all([
          this.getBrands(),
          this.brandToCategoryRepository.find().catch(() => [] as BrandToCategory[]),
        ]).then(([brands, brandsToCategories]) => {
          return brandsToCategories.reduce(
            (a, c) => {
              const list =
                a.get(c.categoryId) ||
                new Map<
                  number,
                  {
                    isPopular: boolean;
                    brand: Brand;
                  }
                >();
              const brand = brands.get(c.brandId);
              if (brand) {
                list.set(c.brandId, {
                  brand,
                  isPopular: !!c.isPopular,
                });
              }
              a.set(c.categoryId, list);
              return a;
            },
            new Map<
              number,
              Map<
                number,
                {
                  isPopular: boolean;
                  brand: Brand;
                }
              >
            >(),
          );
        }),
      environment.cache.long,
    );
  }

  async getBrandsByCategory(categoryId: number): Promise<Brand[]> {
    return Array.from(((await this.getBrandsByCategories())?.get(categoryId) || new Map()).values()).map(
      (brandInfo) => ({ ...brandInfo.brand, isPopular: brandInfo.isPopular }),
    );
  }

  async getBrandsForMainPage() {
    return this.cacheManager.wrap(
      this.CacheKey.BrandsForMainPage,
      async () => {
        return (await this.getBrands())
          .list()
          .filter((b) => b.showOnMain)
          .sort((a, b) => a.order - b.order);
      },
      environment.cache.long,
    );
  }

  async getBrandByIdInCategory(brandId: number, categoryId: number) {
    const brands = await this.getBrandsByCategory(categoryId);
    return brands.find((brand) => brand.id === brandId);
  }

  async getBrandByUrlFromRepository(url: string) {
    return this.brandRepository.findOne({
      where: {
        url,
      },
    });
  }

  async getBrand(id: number) {
    return this.getBrands().then((brands) => brands.get(Number(id)));
  }

  async getBrandByUrl(url: string) {
    return this.getBrands().then((brands) => brands.list().find((brand) => brand.url === url));
  }

  uploadBrandImage(file: Express.Multer.File) {
    return this.imageUpload.uploadBrandImage(file);
  }

  private async removeCache() {
    return Promise.all([
      this.cacheManager.del(this.CacheKey.Brands),
      this.cacheManager.del(this.CacheKey.BrandsForMainPage),
      this.cacheManager.del(this.CacheKey.BrandsByCategories),
    ]);
  }

  async save(newBrand: Brand) {
    return this.brandRepository.save(newBrand).finally(() => this.removeCache());
  }

  async removeById(id: number) {
    return this.brandRepository.delete(id).finally(() => this.removeCache());
  }

  async getCategories(id: number) {
    return this.getBrandsByCategories().then((res) => {
      return Array.from(res.entries()).reduce((a, [categoryId, brandsMap]) => {
        const brandInCategory = brandsMap.get(id);
        if (brandInCategory) {
          a[categoryId] = brandInCategory.isPopular;
        }
        return a;
      }, {});
    });
  }

  async addBrandToCategory(brandId: Brand['id'], categoryId: number, isPopular: boolean) {
    const brandToCategory = new BrandToCategory();
    brandToCategory.brandId = brandId;
    brandToCategory.categoryId = categoryId;
    brandToCategory.isPopular = !!isPopular;
    return this.brandToCategoryRepository.save(brandToCategory).finally(() => this.removeCache());
  }

  async updateBrandToCategory(brandId: Brand['id'], categoryId: number, isPopular: boolean) {
    return this.brandToCategoryRepository
      .update({ brandId, categoryId }, { isPopular })
      .finally(() => this.removeCache());
  }

  async addBrandToCategories(brandId: Brand['id'], categories: Record<Brand['id'], boolean>) {
    return Promise.all(
      Object.entries(categories || {}).map(([catId, isPopular]) => {
        return this.addBrandToCategory(brandId, +catId, isPopular);
      }),
    ).finally(() => this.removeCache());
  }

  async updateBrandToCategories(brandId: Brand['id'], categories: Record<Brand['id'], boolean>) {
    return Promise.all(
      Object.entries(categories || {}).map(([catId, isPopular]) => {
        return this.updateBrandToCategory(brandId, +catId, isPopular);
      }),
    ).finally(() => this.removeCache());
  }

  async removeBrandFromCategories(brandId: Brand['id'], categories: number[]) {
    return this.brandToCategoryRepository
      .delete({
        brandId,
        categoryId: In(categories),
      })
      .finally(() => this.removeCache());
  }
}
