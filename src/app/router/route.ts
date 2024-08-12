import type { Page } from '../../pages';

export abstract class Route {
  static apiNamespace = 'api';

  static adminNamespace = 'admin';

  static readonly controller?: string;

  static readonly path?: string;

  public entries: string[] = [];

  public static get apiController(): string {
    return this.apiUrl(this.controller);
  }

  public static get adminController(): string {
    return this.adminUrl(this.controller);
  }

  public static apiUrl(name = this.controller) {
    return `${Route.apiNamespace}/${name}`;
  }

  public static adminUrl(name = this.controller) {
    return `${Route.apiNamespace}/${Route.adminNamespace}/${name}`;
  }

  public static AdminTags(name?: string): string[] {
    return ['Admin APIs', `Admin APIs - ${name || this.controller}`];
  }

  static link(...args: any[]) {
    return `/${[this.controller, this.path].filter(Boolean).join('/')}`;
  }

  protected get model() {
    return this.constructor as typeof Route;
  }

  setClientEntry(...path: string[]): this {
    this.entries = path;
    return this;
  }

  getClientEntries(page: Page) {
    return this.entries?.length ? this.entries : [`${page}/client/${page}.client.tsx`];
  }
}

// const RouteClientGlobalsDeprecated: Record<RouteType, Record<string, { type: AssetType; src: string }>> = {
//   [RouteType.Default]: {
//     GlobalStyle: {
//       type: AssetType.Style,
//       src: 'layouts/main/main.scss',
//     },
//   },
//   [RouteType.Admin]: {},
// };
