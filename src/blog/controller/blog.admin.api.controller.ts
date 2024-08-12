import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import urlSlug from 'url-slug';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProtectedAdminController } from '../../admin/controller/ProtectedAdminController.abstract';
import { Route } from '../../app/router/route';
import { BlogService } from '../service/blog.service';
import { BlogPostDto, BlogPostEditDto, EditBlogPostPropertyDto } from '../dto/BlogPost.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DTO, sendValidationError } from '../../app/validation/validation.http';
import {
  BlogPostDtoValidator,
  BlogPostEditDtoValidator,
  EditBlogPostPropertyDtoValidator,
} from '../dto/BlogPost.dto.validator';
import { BlogPost } from '../model/BlogPost';
import { Translation } from '../../app/language/language.decorator';
import { TranslationProviderServer } from '../../translation/translation.provider.server';
import { BlogCategory } from '../model/BlogCategory';
import { blogCategoryDto } from '../../catalog/dto/blogCategory.dto';

@Controller(ProtectedAdminController.apiPath('blog'))
@ApiTags(...Route.AdminTags('Blog'))
export class BlogAdminApiController extends ProtectedAdminController {
  constructor(private readonly blogService: BlogService) {
    super();
  }

  @Get()
  async getList() {
    return this.blogService.getAllItems();
  }

  @Get('categories')
  async getCategories() {
    return this.blogService.getCategories();
  }

  @Post('category')
  @ApiBody(blogCategoryDto)
  async createCategory(
    @Body() body: Record<string, string> = {},
    @Translation() translation: TranslationProviderServer,
  ) {
    const blogCategory = BlogCategory.fromJson({
      status: true,
      ...(body || {}),
    });

    console.log(body);
    console.log(blogCategory);

    TranslationProviderServer.availableLanguages().forEach((l) => {
      if (!blogCategory[`name_${l}`]) {
        return sendValidationError(`name_${l}`, 'Name is required');
      }
    });

    blogCategory.url = urlSlug(blogCategory.name_en);

    return this.blogService.saveBlogCategory(blogCategory);
  }

  @Get('category/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async getCategory(@Param('id') categoryId: string) {
    const category = await this.blogService.getCategory(+categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  @Put('category/:id')
  @ApiBody(blogCategoryDto)
  async updateCategory(
    @Param('id') categoryId: string,
    @Body() body: Record<string, string> = {},
    @Translation() translation: TranslationProviderServer,
  ) {
    const category = await this.blogService.getCategory(+categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.fromJson({
      status: category.status,
      ...(body || {}),
    });

    TranslationProviderServer.availableLanguages().forEach((l) => {
      if (!category[`name_${l}`]) {
        return sendValidationError(`name_${l}`, 'Name is required');
      }
    });

    return this.blogService.saveBlogCategory(category);
  }

  @Patch('category/:id')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'boolean',
          nullable: false,
        },
      },
    },
  })
  async updatePropertyCategory(@Param('id') categoryId: string, @Body() body: Record<string, string> = {}) {
    const category = await this.blogService.getCategory(+categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const bKeys = Object.keys(body);

    ['status'].forEach((key) => {
      if (bKeys.includes(key)) {
        category[key] = body[key];
      }
    });

    return this.blogService.saveBlogCategory(category);
  }

  @Delete('category/:id')
  async deleteCategory(@Param('id') categoryId: string) {
    return this.blogService.deleteCategory(+categoryId);
  }

  @Post('content-image')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['image'],
      properties: {
        image: {
          type: 'string',
          nullable: false,
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  async uploadContentImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return sendValidationError('image', 'Image is required');
    }

    return this.blogService
      .uploadBlogContentImage(file)
      .then(({ url }) => ({
        url,
      }))
      .catch((e) => {
        console.warn(e);
        return sendValidationError('image', 'Image is not valid');
      });
  }

  @Get(':id')
  async getItem(@Param('id') id: number) {
    return this.blogService
      .getById(id)
      .catch(() => null)
      .then((item) => {
        if (!item) {
          throw new NotFoundException();
        }
        return item;
      });
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: BlogPostEditDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async createItem(@DTO(BlogPostDtoValidator) dto: BlogPostDto, @UploadedFile() file: Express.Multer.File) {
    dto.publishedAt = new Date(dto.publishedAt) || new Date();
    const post = BlogPost.fromJson(dto);

    // post.url = (dto.url || '')?.replace(/\s+/g, ' ').trim().toLowerCase();
    // if (!post.url?.length) {
    //   return sendValidationError('url', 'URL is required');
    // }
    // post.url = `${post.url}-${Date.now()}`;

    const category = await this.blogService.getCategory(Number(dto.category));

    if (!category) {
      return sendValidationError('category', 'Category not found');
    }

    if (file) {
      post.image = await this.blogService
        .uploadBlogPostMainImage(file)
        .catch((e) => {
          console.warn(e);
          return null;
        })
        .then((i) => i?.url || null);
    }

    post.category = category.id;
    post.active = false;
    post.lang = 'en';

    return this.blogService.savePost(post);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: BlogPostDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateItem(
    @Param('id') id: number,
    @DTO(BlogPostEditDtoValidator) dto: BlogPostEditDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const post = await this.blogService.getById(id);

    if (!post) {
      return sendValidationError('id', 'Item not found');
    }

    dto.publishedAt = new Date(dto.publishedAt) || post.publishedAt || new Date();
    post.fromJson(dto);

    const category = await this.blogService.getCategory(Number(dto.category));

    if (!category) {
      return sendValidationError('category', 'Category not found');
    }

    post.category = category.id;

    if (file) {
      post.image = await this.blogService
        .uploadBlogPostMainImage(file)
        .catch((e) => {
          console.warn(e);
          return null;
        })
        .then((i) => i?.url || null);
    }

    return this.blogService.savePost(post);
  }

  @Patch(':id')
  @ApiBody({
    type: EditBlogPostPropertyDto,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async updateItemProperty(
    @Param('id') id: number,
    @DTO(EditBlogPostPropertyDtoValidator) dto: EditBlogPostPropertyDto,
  ) {
    const post = await this.blogService.getById(id);

    if (!post) {
      return sendValidationError('id', 'Item not found');
    }

    const updateItems = Object.keys(dto);

    if (updateItems.includes('active')) {
      post.active = !!dto.active;
    }

    return this.blogService.savePost(post);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async deleteItem(@Param('id') id: number) {
    return this.blogService
      .removePost(id)
      .then((res) => !!res?.affected)
      .catch(() => false);
  }
}
