import { DropFirst, PageBuilder } from '../models/component';
import { Page } from '../../pages';
import { IRenderService } from './iRenderService';
import { AppInfo } from '../models/app-info';
import { Layout } from '../../layouts/layout.enum';
import { IAppDocumentParameters } from '../models/document';
import { AppResponse } from '../models/request';

export class RenderBuilder {
  protected appRender: IRenderService['render'];
  private _pageBuilder: PageBuilder;
  private _documentParameters: Partial<IAppDocumentParameters>;

  constructor(
    public readonly page: Page,
    public readonly layout: Layout = Layout.Main,
  ) {}

  static withRender(
    appRender: IRenderService['render'],
    ...args: ConstructorParameters<typeof RenderBuilder>
  ): RenderBuilder {
    const builder = new RenderBuilder(...args);
    builder.appRender = appRender;
    return builder;
  }

  from<C extends PageBuilder>(pageBuilder: C, ...args: DropFirst<Parameters<C>>): this {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this._pageBuilder = (appInfo: AppInfo) => pageBuilder(appInfo, ...args);
    return this;
  }

  document(parameters: Partial<IAppDocumentParameters>): this {
    this._documentParameters = parameters;
    return this;
  }

  og(properties: Record<string, any>): this {
    this._documentParameters = {
      ...this._documentParameters,
      og: properties,
    };
    return this;
  }

  render(response: AppResponse) {
    response.timeLabel('before-render');
    return this.appRender(response, this.page, this._pageBuilder, this.layout, this._documentParameters);
  }
}
