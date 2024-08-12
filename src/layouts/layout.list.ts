import { Layout } from './layout.enum';
import { MainLayoutService } from './main/main.layout.service';
import { AdminLayoutService } from './admin/admin.layout.service';
import { AssetType, PageAssets } from '../app/models/document';

export const layoutServices: Record<Layout, { assets: PageAssets }> = {
  [Layout.Main]: MainLayoutService,
  [Layout.Admin]: AdminLayoutService,
};

type LayoutAssets = Record<Layout, PageAssets>;

const coreAssets: PageAssets = {
  [AssetType.Style]: [],
  [AssetType.Script]: ['app/client/core.client.ts'],
};

export const layoutAssets: LayoutAssets = Object.entries(layoutServices).reduce((acc, [layout, service]) => {
  acc[layout] = service.assets as PageAssets;
  acc[layout][AssetType.Style] = [...coreAssets[AssetType.Style], ...(acc[layout][AssetType.Style] || [])];
  acc[layout][AssetType.Script] = [...coreAssets[AssetType.Script], ...(acc[layout][AssetType.Script] || [])];
  return acc;
}, {} as LayoutAssets);
