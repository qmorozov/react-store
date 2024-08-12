import { Body, Controller, Get, Param, Patch, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProtectedAdminController } from '../../admin/controller/ProtectedAdminController.abstract';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { Route } from '../../app/router/route';
import { FileInterceptor } from '@nestjs/platform-express';
import { DTO, onlyFilledFields, sendValidationError } from '../../app/validation/validation.http';
import { CategoryService } from '../../product/service/category.service';
import { CategoryDto, EditCategoryPropertyDto } from '../dto/Category.dto';
import { CategoryDtoValidator, EditCategoryPropertyDtoValidator } from '../dto/Category.dto.validator';
import { Category } from '../../product/models/category.entity';
import { Translation } from '../../app/language/language.decorator';
import { TranslationProviderServer } from '../../translation/translation.provider.server';

@Controller(ProtectedAdminController.apiPath('category'))
@ApiTags(...Route.AdminTags('Categories'))
export class CategoriesAdminController extends ProtectedAdminController {
  constructor(private readonly categoryService: CategoryService) {
    super();
  }

  @Get()
  async getList() {
    return this.categoryService.getCategoriesList();
  }

  @Get(':id')
  async getItem(@Param('id') id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CategoryDto,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateItem(
    @Param('id') id: number,
    @DTO(CategoryDtoValidator) dto: CategoryDto,
    @Body() body: CategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @Translation() translation: TranslationProviderServer,
  ) {
    const item = await this.categoryService.getCategoryById(id);

    if (!item) {
      return sendValidationError('id', 'Item not found');
    }

    dto = onlyFilledFields({ ...(body || {}), ...dto }, true) as CategoryDto;
    const dtoFields = Object.keys(dto) as (keyof CategoryDto)[];

    if (dtoFields.includes('status')) {
      item.status = Category.strBool(dto.status);
    }

    const itemExists = await this.categoryService.getCategoryByUrl(item.url);

    if (itemExists && itemExists?.id !== item.id) {
      return sendValidationError('url', 'Item with this url already exists');
    }

    item.url = dto.url || item.url;

    translation.availableLanguages().forEach((lang) => {
      const field = `name_${lang}`;
      if (!dtoFields.includes(field as any)) {
        return sendValidationError(field, `Name in ${lang} is required`);
      }
      item[field] = dto[field];
    });

    if (file) {
      item.image = await this.categoryService
        .uploadCategoryImage(file)
        .catch((e) => {
          console.warn(e);
          return null;
        })
        .then((i) => i?.url || null);
    }

    return this.categoryService.update(item);
  }

  @Patch(':id')
  @ApiBody({
    type: EditCategoryPropertyDto,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async updateItemProperty(
    @Param('id') id: number,
    @DTO(EditCategoryPropertyDtoValidator) dto: EditCategoryPropertyDto,
  ) {
    const item = await this.categoryService.getCategoryById(id);

    if (!item) {
      return sendValidationError('id', 'Item not found');
    }

    dto = onlyFilledFields(dto, true) as EditCategoryPropertyDto;
    const dtoFields = Object.keys(dto) as (keyof CategoryDto)[];

    if (dtoFields.includes('status')) {
      item.status = Category.strBool(dto.status);
    }

    return this.categoryService.update(item);
  }
}
