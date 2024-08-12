import { StorageKey } from './StorageKey';

export interface StorageFileLocation {
  storage: StorageKey;
  bucket?: string;
  prefix: string;
}
