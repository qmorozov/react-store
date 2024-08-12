import { Injectable } from '@nestjs/common';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { StorageFileLocationKey, StorageKey } from '../model/StorageKey';
import environment from '../../app/configuration/configuration.env';
import { StorageFileLocation } from '../model/StorageFileLocation';
import { PutObjectCommandInput } from '@aws-sdk/client-s3/dist-types/commands/PutObjectCommand';
import { StorageFileInfo } from '../model/StorageFileInfo';
import { DigitalOceanSpacesStorage, ExternalStorage } from '../model/Storage';

type UploadFileContent = PutObjectCommandInput['Body'];

type FilePermission = PutObjectCommandInput['ACL'];

export interface UploadFile {
  ContentType: string | undefined;
  Body: UploadFileContent;
  ACL?: FilePermission;
}

@Injectable()
export class StorageService {
  private readonly storage: Record<StorageKey, ExternalStorage> = {
    [StorageKey.Main]: new DigitalOceanSpacesStorage(environment.storage[StorageKey.Main], {
      main: 'qmorozov-file',
    } as const),
  };

  private readonly locations: Record<StorageFileLocationKey, StorageFileLocation> = {
    [StorageFileLocationKey.ShopLogo]: {
      storage: StorageKey.Main,
      prefix: 'shop/logo',
    } as const,
    [StorageFileLocationKey.UserLogo]: {
      storage: StorageKey.Main,
      prefix: 'user/logo',
    } as const,
    [StorageFileLocationKey.ProductImage]: {
      storage: StorageKey.Main,
      prefix: 'product/image',
    } as const,
    [StorageFileLocationKey.LandingSlideImage]: {
      storage: StorageKey.Main,
      prefix: 'landing/slides',
    } as const,
    [StorageFileLocationKey.BrandLogo]: {
      storage: StorageKey.Main,
      prefix: 'brand/logo',
    } as const,
    [StorageFileLocationKey.MessageImage]: {
      storage: StorageKey.Main,
      prefix: 'message/image',
    } as const,
    [StorageFileLocationKey.CategoryImage]: {
      storage: StorageKey.Main,
      prefix: 'category/image',
    } as const,
    [StorageFileLocationKey.BlogPostMain]: {
      storage: StorageKey.Main,
      prefix: 'blog/preview',
    } as const,
    [StorageFileLocationKey.BlogPostContentImage]: {
      storage: StorageKey.Main,
      prefix: 'blog/content',
    } as const,
  } as const;

  public async uploadShopLogo(fileName: string, content: UploadFile, permission?: FilePermission) {
    return this.uploadToLocation(fileName, content, StorageFileLocationKey.ShopLogo, permission);
  }

  public async uploadUserLogo(fileName: string, content: UploadFile, permission?: FilePermission) {
    return this.uploadToLocation(fileName, content, StorageFileLocationKey.UserLogo, permission);
  }

  public async uploadProductImage(fileName: string, content: UploadFile, permission?: FilePermission) {
    return this.uploadToLocation(fileName, content, StorageFileLocationKey.ProductImage, permission);
  }

  public async uploadLandingSlideImage(fileName: string, content: UploadFile, permission?: FilePermission) {
    return this.uploadToLocation(fileName, content, StorageFileLocationKey.LandingSlideImage, permission);
  }

  public async uploadCategoryImage(fileName: string, content: UploadFile, permission?: FilePermission) {
    return this.uploadToLocation(fileName, content, StorageFileLocationKey.CategoryImage, permission);
  }

  public async uploadBlogContentImage(fileName: string, content: UploadFile, permission?: FilePermission) {
    return this.uploadToLocation(fileName, content, StorageFileLocationKey.BlogPostContentImage, permission);
  }

  public async uploadBlogPostMainImage(fileName: string, content: UploadFile, permission?: FilePermission) {
    return this.uploadToLocation(fileName, content, StorageFileLocationKey.BlogPostMain, permission);
  }

  public async uploadBrandImage(fileName: string, content: UploadFile, permission?: FilePermission) {
    return this.uploadToLocation(fileName, content, StorageFileLocationKey.BrandLogo, permission);
  }

  public async uploadMessageImage(fileName: string, content: UploadFile, permission?: FilePermission) {
    return this.uploadToLocation(fileName, content, StorageFileLocationKey.MessageImage, permission);
  }

  private async uploadToLocation(
    fileKey: string,
    content: UploadFile,
    location: keyof StorageService['locations'],
    permission?: FilePermission,
  ) {
    const { storage, bucket, prefix } = this.locations[location];
    return this.upload(`${prefix}/${fileKey}`, content, bucket, storage, permission);
  }

  private async upload(
    fileKey: string,
    content: UploadFile,
    bucket: string,
    storageKey: StorageKey,
    permission: FilePermission = 'public-read',
  ): Promise<StorageFileInfo> {
    const storage = this.storage[storageKey];
    bucket = bucket || storage.buckets.main;
    return storage.client
      .send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: fileKey,
          ...content,
          ACL: content?.ACL || permission,
        }),
      )
      .then((originalInfo) => ({
        originalInfo,
        fileKey,
        bucket,
        storage: storageKey,
        url: storage.getCdnUrl(fileKey, bucket),
      }));
  }
}
