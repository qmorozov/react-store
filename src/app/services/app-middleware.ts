import { AppRequest } from '../models/request';
import { ServeStaticConfiguration } from './serve-static.configuration';
import environment from '../configuration/configuration.env';
import { extname } from 'path';

export abstract class AppMiddleware {
  private static readonly routes = ServeStaticConfiguration.getRoutes();

  protected canUse(req: AppRequest): boolean {
    return req.method !== 'GET' || this.isNotFile(req);
  }

  private isNotFile(req: AppRequest): boolean {
    return !environment.fileServing.enabled || !extname(req.url);
  }
}
