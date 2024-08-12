import { Injectable } from '@nestjs/common';
import { ImageUploadService } from '../../storage/service/image-upload.service';
import { Repository } from 'typeorm';
import { BannerSlide } from '../model/banner-slide';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';

@Injectable()
export class BannerService {
  constructor(
    @InjectRepository(BannerSlide, Database.Main) private readonly slidesRepository: Repository<BannerSlide>,
    private readonly imageUpload: ImageUploadService,
  ) {}

  async uploadBannerImage(file: Express.Multer.File) {
    return this.imageUpload.uploadLandingSlideImage(file);
  }

  save(bannerSlide: BannerSlide) {
    return this.slidesRepository.save(bannerSlide).then((r) => {
      !!this.updateCache();
      return r;
    });
  }

  getSlides() {
    return this.slidesRepository.find({
      order: {
        order: 'ASC',
      },
    });
  }

  private _slidesCache: BannerSlide[];

  async getSlidesCashed() {
    if (!this._slidesCache) {
      await this.updateCache();
    }
    return this._slidesCache;
  }

  private async updateCache() {
    return (this._slidesCache = await this.getSlides());
  }

  async getSlideById(id: number) {
    return this.slidesRepository.findOne({
      where: { id },
    });
  }

  async removeSlide(id: number) {
    return this.slidesRepository.delete(id).then((r) => {
      !!this.updateCache();
      return r;
    });
  }
}
