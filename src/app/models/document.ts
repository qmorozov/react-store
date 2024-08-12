export const enum AssetType {
  Style,
  Script,
}

export type AssetInfo = {
  local: boolean;
  src: string;
};

export type PageAssets = Record<AssetType, (string | AssetInfo)[]>;

export type PageAssetsString = Record<AssetType, string[]>;

export abstract class Asset {
  static fromUrl(url: string): AssetInfo {
    return { local: false, src: url };
  }
}

export interface IAppDocumentParameters {
  language: string;
  title: string;
  search?: string;
  og?: Record<string, any>;
}
