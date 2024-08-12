import {
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
import { ProtectedAdminController } from '../../admin/controller/ProtectedAdminController.abstract';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { Route } from '../../app/router/route';
import { BrandsService } from '../../product/service/brands.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddBrandDto, EditBrandDto, EditBrandPropertyDto } from '../dto/AddBrand.dto';
import { DTO, onlyFilledFields, sendValidationError, validateDto } from '../../app/validation/validation.http';
import {
  AddBrandDtoValidator,
  EditBrandDtoValidator,
  EditBrandPropertyDtoValidator,
} from '../dto/AddBrand.dto.validator';
import { Brand } from '../../product/models/brand.entity';
import { safeJsonParse } from '../../app/services/server.helper';
import urlSlug from 'url-slug';
import ShortUniqueId from 'short-unique-id';

@Controller(ProtectedAdminController.apiPath('brands'))
@ApiTags(...Route.AdminTags('Brands'))
export class BrandsAdminController extends ProtectedAdminController {
  constructor(private readonly brandsService: BrandsService) {
    super();
  }

  @Get()
  async getBrands() {
    return this.brandsService.getBrandsFromRepository();
  }

  @Get(':id')
  async getBrand(@Param('id') id: number) {
    const brand = await this.brandsService.getBrand(id);

    if (!brand) {
      throw new NotFoundException();
    }

    return {
      ...brand,
      categories: await this.getBrandCategories(brand.id),
    };
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: AddBrandDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async addBrand(@DTO(AddBrandDtoValidator) dto: AddBrandDto, @UploadedFile() file: Express.Multer.File) {
    const newBrand = Brand.fromJson(dto);
    newBrand.url = urlSlug(newBrand.name);
    newBrand.order = Number(dto?.order) ?? 0;
    validateDto(AddBrandDtoValidator, newBrand);

    const brandExists = await this.brandsService.getBrandByUrlFromRepository(newBrand.url);

    if (brandExists) {
      newBrand.url = `${newBrand.url}-${new ShortUniqueId().rnd(4)}`;
    }

    if (file) {
      newBrand.image = await this.brandsService
        .uploadBrandImage(file)
        .catch((e) => {
          console.warn(e);
          return null;
        })
        .then((i) => i?.url || null);
    }

    return this.brandsService.save(newBrand).then(async (brand) => {
      await this.updateBrandCategories(brand, dto.categories);
      return {
        ...brand,
        categories: await this.getBrandCategories(brand.id),
      };
    });
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: EditBrandDto,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateBrand(
    @Param('id') id: number,
    @DTO(EditBrandDtoValidator) dto: EditBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const brand = await this.brandsService.getBrand(id);

    if (!brand) {
      return sendValidationError('id', 'Brand not found');
    }

    brand.fromJson(dto);
    brand.order = Number(dto?.order ?? brand?.order) ?? 0;
    validateDto(AddBrandDtoValidator, brand);

    const brandExists = await this.brandsService.getBrandByUrlFromRepository(brand.url);
    if (brandExists && brandExists?.id !== brand.id) {
      return sendValidationError('url', 'Brand with this url already exists');
    }

    if (file) {
      brand.image = await this.brandsService
        .uploadBrandImage(file)
        .catch((e) => {
          console.warn(e);
          return null;
        })
        .then((i) => i?.url || null);
    }

    await this.updateBrandCategories(brand, dto.categories);

    return this.brandsService.save(brand).then(async (brand) => {
      return {
        ...brand,
        categories: await this.getBrandCategories(brand.id),
      };
    });
  }

  private async getBrandCategories(id: Brand['id']) {
    return (await this.brandsService.getCategories(id).catch(() => ({}))) || {};
  }

  private async updateBrandCategories(brand: Brand, categories: Record<string, boolean>) {
    const forCategories = typeof categories === 'string' ? safeJsonParse(categories || '{}', {}) : categories;
    const currentCategories = brand.id ? await this.getBrandCategories(brand.id) : {};

    const newKeys = Object.keys(forCategories);
    const existingKeys = Object.keys(currentCategories);

    const working = Array.from(new Set([...newKeys, ...existingKeys])).reduce(
      (acc, bid) => {
        const inNew = newKeys.includes(bid);
        const inExisting = existingKeys.includes(bid);

        if (!inNew && inExisting) {
          acc.remove.push(bid);
        } else if (inNew && !inExisting) {
          acc.add[bid] = forCategories[bid];
        } else if (inNew && inExisting && forCategories[bid] !== currentCategories[bid]) {
          acc.update[bid] = forCategories[bid];
        }

        return acc;
      },
      {
        add: {},
        update: {},
        remove: [],
      },
    );

    return Promise.all([
      this.brandsService.addBrandToCategories(brand.id, working.add),
      this.brandsService.updateBrandToCategories(brand.id, working.update),
      this.brandsService.removeBrandFromCategories(brand.id, working.remove),
    ]);
  }

  @Patch(':id')
  @ApiBody({
    type: EditBrandPropertyDto,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async updateBrandProperty(@Param('id') id: number, @DTO(EditBrandPropertyDtoValidator) dto: EditBrandPropertyDto) {
    const brand = await this.brandsService.getBrand(id);

    if (!brand) {
      return sendValidationError('id', 'Brand not found');
    }

    brand.fromJson(onlyFilledFields(dto));
    validateDto(EditBrandPropertyDtoValidator, brand);

    return this.brandsService.save(brand);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async deleteBrand(@Param('id') id: number) {
    return this.brandsService
      .removeById(id)
      .then((res) => !!res?.affected)
      .catch(() => false);
  }
}
