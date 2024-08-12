import { Inject, Injectable, Optional } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Response } from 'express';
import { renderToStaticMarkup, renderToStaticNodeStream } from 'react-dom/server';
import { join } from 'path';
import { Page } from '../../pages';
import { PageBuilder } from '../models/component';
import { Routes } from '../../routes';
import environment from '../configuration/configuration.env';
import { AssetMode } from '../configuration/asset-mode.enum';

import devServer from '../builder/client-dev-server';
import ClientRenderProxy from '../view/ClientRenderProxy';
import { AppRequest } from '../models/request';
import { RenderBuilder } from './render-builder';
import { IRenderService } from './iRenderService';
import { AppInfo } from '../models/app-info';
import { iLayoutService } from '../../layouts/iLayout';
import { MainLayoutService } from '../../layouts/main/main.layout.service';
import { Layout } from '../../layouts/layout.enum';
import { AdminLayoutService } from '../../layouts/admin/admin.layout.service';
import { AssetType, IAppDocumentParameters, PageAssets, PageAssetsString } from '../models/document';
import { layoutAssets } from '../../layouts/layout.list';
import AppDocument from '../view/App';

@Injectable()
export class RenderService implements IRenderService {
  #manifest: Promise<Record<string, string>>;

  private isDev = environment.asset.mode === AssetMode.Development;

  get manifest(): Promise<Record<string, { file: string; css?: string[] }> | undefined> {
    if (!this.isDev && !this.#manifest) {
      this.#manifest = import(join(__dirname, '../../../client/manifest.json'));
    }
    return this.#manifest || Promise.resolve(undefined);
  }

  private readonly layouts: Record<Layout, iLayoutService>;

  constructor(
    @Inject(REQUEST) @Optional() private readonly request: AppRequest | undefined,
    mainLayout: MainLayoutService,
    adminLayout: AdminLayoutService,
  ) {
    this.layouts = {
      [Layout.Main]: mainLayout,
      [Layout.Admin]: adminLayout,
    };
  }

  private async getAssets(page: Page, layout?: Layout) {
    const options = Routes[page];

    const assets: PageAssets = {
      [AssetType.Style]: [],
      [AssetType.Script]: [],
    };

    if (layout) {
      Object.entries(layoutAssets[layout] || {}).forEach(([type, layoutAssetsOnType]) => {
        (layoutAssetsOnType || []).forEach((value) => assets[type as unknown as AssetType].push(value));
      });
    }

    assets[AssetType.Script].push(...options.getClientEntries(page));

    const manifest = (await this.manifest) || {};

    [AssetType.Style, AssetType.Script].forEach((type) => {
      assets[type] = assets[type].map((assetByType): string => {
        const asset = typeof assetByType === 'string' ? assetByType : assetByType.src;

        if (typeof assetByType !== 'string') {
          return asset;
        }

        if (manifest[asset]?.css?.length) {
          manifest[asset].css.forEach((css) => {
            return assets[AssetType.Style].push(`/${css}`);
          });
        }
        return `/${manifest[asset]?.file || asset}`;
      });
    });

    return assets as PageAssetsString;
  }

  build(...args: ConstructorParameters<typeof RenderBuilder>): RenderBuilder {
    return RenderBuilder.withRender(this.render.bind(this), ...args);
  }

  private async documentParameters(rewrites: Partial<IAppDocumentParameters> = {}): Promise<IAppDocumentParameters> {
    return Object.assign(
      {
        language: this.request.language,
        title: 'qmorozov',
      },
      rewrites,
    );
  }

  private async createAppInfo(): Promise<AppInfo> {
    return {
      url: this.request.url,
      translation: this.request.translation,
      user: this.request.user,
    };
  }

  /**
   * @deprecated The method should not be used outside. Use build instead
   */
  async render(
    response: Response,
    page: Page,
    view: PageBuilder,
    layout: Layout = Layout.Main,
    documentParameters?: Partial<IAppDocumentParameters>,
  ) {
    response.type('html');
    response.write('<!DOCTYPE html>');

    const appInfo = await this.createAppInfo();
    const layoutService = await this.layouts[layout].ready(appInfo);

    const pageMarkup = await Promise.all([
      this.getAssets(page, layout),
      this.documentParameters(documentParameters),
      layoutService.userReady(appInfo),
    ]).then(([assets, parameters, userAppInfo]) => {
      userAppInfo.document = parameters;
      return AppDocument(layoutService.render(userAppInfo, view(userAppInfo)), assets, parameters, userAppInfo);
    });

    if (this.isDev) {
      return response.end(await this.devServer(pageMarkup));
    }

    return renderToStaticNodeStream(pageMarkup).pipe(response);
  }

  async renderOnClient(response: Response, page: Page, layout: Layout = Layout.Main) {
    return this.render(response, page, () => ClientRenderProxy(), layout);
  }

  private async devServer(page) {
    const html = renderToStaticMarkup(page);
    return (await devServer).transformIndexHtml(this.request?.url || '/', html);
  }
}
