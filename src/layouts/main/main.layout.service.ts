import { Injectable } from '@nestjs/common';
import { aLayoutService, iLayoutService } from '../iLayout';
import MainLayout from './main.layout';
import { AppInfo } from '../../app/models/app-info';
import { CategoryService } from '../../product/service/category.service';
import { Category } from '../../product/models/category.entity';
import { Asset, AssetType } from '../../app/models/document';
import { CartService } from '../../cart/service/cart.service';

@Injectable()
export class MainLayoutService extends aLayoutService implements iLayoutService {
  static assets = {
    [AssetType.Style]: [
      Asset.fromUrl('https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap'),
      'layouts/main/main.scss',
    ],
    [AssetType.Script]: ['layouts/main/main.client.tsx'],
  };

  view = MainLayout;

  categories: Category[];

  constructor(
    private readonly categoryService: CategoryService,
    private readonly cartService: CartService,
  ) {
    super();
  }

  render(appInfo: AppInfo, children: JSX.Element): JSX.Element {
    return this.view(
      appInfo,
      children,
      this.categories.map((c) => c.setLanguage(appInfo.translation.language)),
    );
  }

  async userReady(appInfo: AppInfo): Promise<AppInfo> {
    appInfo.cart = {
      count: await this.cartService.getCartItemsCount(appInfo?.user),
    };
    return appInfo;
  }

  async load(appInfo: AppInfo) {
    const categories = await this.categoryService.getMainCategories().catch(() => []);

    const categoryByGroup = (categories || []).reduce((a, c) => {
      const list = a.get(c.parentId) || new Set<Category>();
      list.add(c);
      a.set(c.parentId, list);
      return a;
    }, new Map<number, Category>());

    const categoryGroups = ((await this.categoryService.getCategoryGroups().catch(() => [])) || []).reduce((a, c) => {
      c.subCategories = Array.from(categoryByGroup.get(c.id) || []);
      a.set(c.id, c);
      return a;
    }, new Map<number, Category>());

    this.categories = Array.from(
      new Set<Category>((categories || []).map((c) => (c.parentId && categoryGroups.get(c.parentId)) || c)),
    ).sort((a, b) => a.order - b.order);

    return this;
  }
}
