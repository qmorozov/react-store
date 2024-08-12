import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { In, Repository } from 'typeorm';
import { BlogCategory } from '../model/BlogCategory';
import { BlogPost } from '../model/BlogPost';
import { PaginationService } from '../../catalog/service/pagination.service';
import { ImageUploadService } from '../../storage/service/image-upload.service';

@Injectable()
export class BlogService {
  private blogCategories: BlogCategory[] = [];

  constructor(
    @InjectRepository(BlogCategory, Database.Main)
    protected readonly blogCategoriesRepository: Repository<BlogCategory>,
    @InjectRepository(BlogPost, Database.Main)
    protected readonly blogPostsRepository: Repository<BlogPost>,
    private readonly imageUpload: ImageUploadService,
  ) {}

  async getCategories() {
    if (this.blogCategories?.length) {
      return this.blogCategories;
    }
    return this.blogCategoriesRepository
      .find({
        where: {
          status: true,
        },
      })
      .then((res) => (this.blogCategories = res || []));
  }

  async getCategory(categoryId: number) {
    const category = this.blogCategories.find((c) => c.id === categoryId);

    if (category) {
      return category;
    }

    return await this.blogCategoriesRepository.findOne({
      where: {
        id: categoryId,
        status: true,
      },
    });
  }

  async getLastPosts(limit: number, categoryIds: number[] | undefined) {
    return this.blogPostsRepository.find({
      where: {
        active: true,
        lang: 'en',
        category: categoryIds?.length ? In(categoryIds) : undefined,
      },
      order: {
        publishedAt: 'DESC',
      },
      take: limit,
    });
  }

  async getList(pagination: PaginationService, categoryIds: number[] | undefined) {
    return this.blogPostsRepository.findAndCount({
      where: {
        active: true,
        lang: 'en',
        category: categoryIds?.length ? In(categoryIds) : undefined,
      },
      order: {
        createdAt: 'DESC',
      },
      skip: pagination.offset,
      take: pagination.limit,
    });
  }

  async getPostByUrl(postUrl: string) {
    return this.blogPostsRepository.findOne({
      where: {
        url: postUrl,
        lang: 'en',
        active: true,
      },
    });
  }

  getAllItems(status?) {
    return this.blogPostsRepository.find({
      where: {
        lang: 'en',
        ...(status === true || status === false ? { status } : {}),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  getById(id: number) {
    return this.blogPostsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async uploadBlogPostMainImage(file: Express.Multer.File) {
    return this.imageUpload.uploadBlogPostMainImage(file);
  }

  async uploadBlogContentImage(file: Express.Multer.File) {
    return this.imageUpload.uploadBlogContentImage(file);
  }

  async savePost(post: BlogPost) {
    return this.blogPostsRepository.save(post);
  }

  async removePost(id: number) {
    return this.blogPostsRepository.delete({
      id,
    });
  }

  saveBlogCategory(blogCategory: BlogCategory) {
    return this.blogCategoriesRepository.save(blogCategory);
  }

  deleteCategory(number: number) {
    return this.blogCategoriesRepository
      .delete({
        id: number,
      })
      .then((res) => !!res.affected)
      .catch(() => false);
  }
}
