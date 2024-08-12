import { ProtectedAdminController } from '../../admin/controller/ProtectedAdminController.abstract';
import { Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiParam, ApiTags } from '@nestjs/swagger';
import { Route } from '../../app/router/route';
import { BannerService } from '../service/Banner.service';
import { AddBannerSlideDto, EditBannerSlideDto } from '../dto/BannerSlide.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { DTO, onlyFilledFields, sendValidationError } from '../../app/validation/validation.http';
import { AddBannerSlideDtoValidator, EditBannerSlideDtoValidator } from '../dto/BannerSlide.dto.validator';
import { BannerSlide } from '../model/banner-slide';
import { SiteMap } from '../../app/services/SiteMap';

@Controller(ProtectedAdminController.apiPath('landing'))
@ApiTags(...Route.AdminTags('Landing'))
export class MainAdminController extends ProtectedAdminController {
  constructor(
    private readonly bannerService: BannerService,
    protected readonly siteMap: SiteMap,
  ) {
    super();
  }

  @Post('sitemap')
  async createSitemap() {
    return this.siteMap.refreshSiteMap();
  }

  @Get('slides')
  async getSlides() {
    return this.bannerService.getSlides().then((slides) => slides.map((slide) => slide.toJson()));
  }

  @Post('slides')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: AddBannerSlideDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async addSlide(@DTO(AddBannerSlideDtoValidator) dto: AddBannerSlideDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return sendValidationError('image', 'Image is required');
    }

    const image = (await this.bannerService.uploadBannerImage(file))?.url;

    if (!image) {
      return sendValidationError('image', 'Upload failed');
    }

    const bannerSlide = BannerSlide.fromJson(dto);
    bannerSlide.image = image;
    return this.bannerService.save(bannerSlide).then((slide) => slide.toJson());
  }

  @Get('slides/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async getSlide(@Param('id') id: number) {
    return this.bannerService.getSlideById(id).then((slide) => slide.toJson());
  }

  @Put('slides/:id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: EditBannerSlideDto,
  })
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  @UseInterceptors(FileInterceptor('image'))
  async updateSlide(
    @Param('id') id: number,
    @DTO(EditBannerSlideDtoValidator) dto: EditBannerSlideDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const bannerSlide = await this.bannerService.getSlideById(id);

    if (!bannerSlide) {
      return sendValidationError('id', 'Slide not found');
    }

    bannerSlide.fromJson(onlyFilledFields(dto));

    if (file) {
      const image = (await this.bannerService.uploadBannerImage(file))?.url;

      if (!image) {
        return sendValidationError('image', 'Upload failed');
      }

      bannerSlide.image = image;
    }

    return this.bannerService.save(bannerSlide).then((slide) => slide.toJson());
  }

  @Delete('slides/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async deleteSlide(@Param('id') id: number) {
    return this.bannerService
      .removeSlide(id)
      .then((res) => !!res?.affected)
      .catch(() => false);
  }
}
