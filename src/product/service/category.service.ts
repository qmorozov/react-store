import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { Category } from '../models/category.entity';
import { Database } from '../../app/database/database.enum';
import { ProductType } from '../models/ProductType.enum';
import { ImageUploadService } from '../../storage/service/image-upload.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import environment from '../../app/configuration/configuration.env';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category, Database.Main) private categoryRepository: Repository<Category>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly imageUpload: ImageUploadService,
  ) {}

  async getMainCategories(): Promise<Category[]> {
    return this.cacheManager.wrap(
      'mainCategories',
      () =>
        this.categoryRepository.find({
          where: {
            status: true,
            productType: In(Object.values(ProductType)),
          },
        }),
      environment.cache.long,
    );
  }

  async getCategoryGroups() {
    return this.cacheManager.wrap(
      'categoryGroups',
      () =>
        this.categoryRepository.find({
          where: {
            status: true,
            parentId: IsNull(),
            productType: IsNull(),
          },
        }),
      environment.cache.long,
    );
  }

  async mainCategoryByType(type: ProductType): Promise<Category> {
    const categories = await this.getMainCategories();
    return categories.find((category) => category.productType === type);
  }

  async save(category: Category) {
    return this.categoryRepository.save(category);
  }

  async getCategoriesList() {
    return this.categoryRepository.find({
      where: {
        productType: In(Object.values(ProductType)),
      },
    });
  }

  async getCategoryById(id: number) {
    return this.categoryRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getCategoryByUrl(url: string) {
    return this.categoryRepository.findOne({
      where: {
        url,
      },
    });
  }

  async uploadCategoryImage(file: Express.Multer.File) {
    return this.imageUpload.uploadCategoryImage(file);
  }

  async update(item: Category) {
    return this.save(item).then((item) => {
      this.cacheManager.del('mainCategories');
      this.cacheManager.del('categoryGroups');
      return item;
    });
  }
}
