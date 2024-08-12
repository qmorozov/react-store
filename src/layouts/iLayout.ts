import { AppInfo } from '../app/models/app-info';
import { PageAssets } from '../app/models/document';

export type iLayout = (appInfo: AppInfo, children: JSX.Element, ...args: any[]) => JSX.Element;

export interface iLayoutService {
  view: iLayout;

  render(appInfo: AppInfo, children: JSX.Element): JSX.Element;

  ready(appInfo: AppInfo): Promise<this>;

  userReady(appInfo: AppInfo): Promise<AppInfo>;
}

export abstract class aLayoutService {
  abstract view: iLayoutService['view'];

  static assets: PageAssets;

  protected isReady = false;

  protected async load(appInfo: AppInfo): Promise<this> {
    return this;
  }

  public async userReady(appInfo: AppInfo): Promise<AppInfo> {
    return appInfo;
  }

  render(appInfo: AppInfo, children: JSX.Element) {
    return this.view(appInfo, children);
  }

  async ready(appInfo: AppInfo): Promise<this> {
    if (!this.isReady) {
      await this.load(appInfo);
      this.isReady = true;
    }
    return this;
  }
}
