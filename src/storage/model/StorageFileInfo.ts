import { PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { StorageKey } from './StorageKey';

export interface StorageFileInfo {
  originalInfo: PutObjectCommandOutput;
  fileKey: string;
  bucket: string;
  storage: StorageKey;
  url: string;
}
