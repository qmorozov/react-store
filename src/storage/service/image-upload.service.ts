import { Injectable } from '@nestjs/common';
import { sendFormError } from '../../app/validation/validation.http';
import { StorageService, UploadFile } from './storage.service';
import sharp from 'sharp';
import ShortUniqueId from 'short-unique-id';
import { StorageFileInfo } from '../model/StorageFileInfo';
import environment from '../../app/configuration/configuration.env';

@Injectable()
export class ImageUploadService {
  private readonly uniqId = new ShortUniqueId({ length: 16 });

  constructor(private readonly storageService: StorageService) {}

  private async checkFile(file: Express.Multer.File, allowedTypes: string[]) {
    if (!file || !file.buffer || !file.mimetype || !file.size) {
      sendFormError('file', 'File is not valid.');
      return false;
    }

    if (!(!allowedTypes?.length || allowedTypes.find((t) => file.mimetype?.startsWith(t)))) {
      sendFormError('file', 'File type is not allowed.');
      return false;
    }

    return true;
  }

  private _toUploadFile(file: Express.Multer.File, content: UploadFile['Body']): UploadFile {
    return {
      Body: content,
      ContentType: file.mimetype,
    };
  }

  async uploadShopLogo(file: Express.Multer.File): Promise<string> {
    if (await this.checkFile(file, ['image/'])) {
      return sharp(file.buffer)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .resize(environment.image.shopLogo.width, environment.image.shopLogo.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .toFormat('jpeg')
        .toBuffer()
        .then((buffer) =>
          this.storageService.uploadShopLogo(`${this.uniqId.rnd()}.jpg`, this._toUploadFile(file, buffer)),
        )
        .then((info) => info.url);
    }
    return Promise.reject();
  }

  async uploadUserLogo(file: Express.Multer.File): Promise<string> {
    if (await this.checkFile(file, ['image/'])) {
      return sharp(file.buffer)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .resize(environment.image.shopLogo.width, environment.image.shopLogo.height, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .toFormat('jpeg')
        .toBuffer()
        .then((buffer) =>
          this.storageService.uploadUserLogo(`${this.uniqId.rnd()}.jpg`, this._toUploadFile(file, buffer)),
        )
        .then((info) => info.url);
    }
    return Promise.reject();
  }

  async uploadProductImage(file: Express.Multer.File) {
    if (await this.checkFile(file, ['image/'])) {
      const name = this.uniqId.rnd();
      return Promise.all(
        Object.keys(environment.image.productImage).map((size) =>
          this.uploadProductImageBySize(name, file, size).then((res) => {
            return { [size]: res.url };
          }),
        ),
      ).then((res) => Object.assign({ id: name }, ...res));
    }
    return Promise.reject();
  }

  async uploadCategoryImage(file: Express.Multer.File) {
    if (await this.checkFile(file, ['image/'])) {
      return sharp(file.buffer)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .resize({
          width: environment.image.brand.width,
          height: environment.image.brand.height,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .toFormat('jpeg')
        .toBuffer()
        .then((buffer) =>
          this.storageService.uploadCategoryImage(`${this.uniqId.rnd()}.jpg`, this._toUploadFile(file, buffer)),
        );
    }
    return Promise.reject();
  }

  async uploadBlogPostMainImage(file: Express.Multer.File) {
    if (await this.checkFile(file, ['image/'])) {
      return sharp(file.buffer)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .resize({
          width: environment.image.blog.main.width,
          height: environment.image.blog.main.height,
          fit: 'cover',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .toFormat('jpeg')
        .toBuffer()
        .then((buffer) =>
          this.storageService.uploadBlogPostMainImage(`${this.uniqId.rnd()}.jpg`, this._toUploadFile(file, buffer)),
        );
    }
    return Promise.reject();
  }

  async uploadBlogContentImage(file: Express.Multer.File) {
    if (await this.checkFile(file, ['image/'])) {
      return sharp(file.buffer)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .resize({
          width: environment.image.blog.content.width,
          height: environment.image.blog.content.height,
          fit: 'inside',
          withoutEnlargement: true,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .toFormat('jpeg')
        .toBuffer()
        .then((buffer) =>
          this.storageService.uploadBlogContentImage(`${this.uniqId.rnd()}.jpg`, this._toUploadFile(file, buffer)),
        );
    }
    return Promise.reject();
  }

  async uploadBrandImage(file: Express.Multer.File) {
    if (await this.checkFile(file, ['image/'])) {
      return sharp(file.buffer)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .resize({
          width: environment.image.brand.width,
          height: environment.image.brand.height,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .toFormat('jpeg')
        .toBuffer()
        .then((buffer) =>
          this.storageService.uploadBrandImage(`${this.uniqId.rnd()}.jpg`, this._toUploadFile(file, buffer)),
        );
    }
    return Promise.reject();
  }

  async uploadMessageImage(file: Express.Multer.File) {
    if (await this.checkFile(file, ['image/'])) {
      const name = this.uniqId.rnd();
      return sharp(file.buffer)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .resize({
          fit: 'inside',
          width: environment.image.message.width,
          height: environment.image.message.height,
          withoutEnlargement: true,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .toFormat('jpeg')
        .toBuffer()
        .then((buffer) => this.storageService.uploadMessageImage(`${name}.jpg`, this._toUploadFile(file, buffer)));
    }
    return Promise.reject();
  }

  async uploadLandingSlideImage(file: Express.Multer.File) {
    if (await this.checkFile(file, ['image/'])) {
      const name = this.uniqId.rnd();
      return sharp(file.buffer)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .resize({
          width: environment.image.landingSlide.width,
          height: environment.image.landingSlide.height,
          fit: 'cover',
        })
        .toFormat('jpeg')
        .toBuffer()
        .then((buffer) => this.storageService.uploadLandingSlideImage(`${name}.jpg`, this._toUploadFile(file, buffer)));
    }
    return Promise.reject();
  }

  async uploadProductImageBySize(name: string, file: Express.Multer.File, size: string): Promise<StorageFileInfo> {
    return sharp(file.buffer)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .resize(environment.image.productImage[size].width, environment.image.productImage[size].height, {
        fit: 'cover',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .toFormat('jpeg')
      .toBuffer()
      .then((buffer) =>
        this.storageService.uploadProductImage(`${name}.${size}.jpg`, this._toUploadFile(file, buffer)),
      );
  }
}
