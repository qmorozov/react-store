import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppRequest } from '../models/request';
import type { ParsedQs } from 'qs';
import QueryString from 'querystring';

export class QueryBuilder {
  constructor(public path: string, public query: ParsedQs) {}

  extendLink(query: Record<string, string> = {}) {
    return this.link({ ...(this.query as Record<string, any>), ...query });
  }

  link(query: Record<string, string> = {}) {
    return `${this.path}?${QueryString.stringify(query)}`;
  }

  get<T>(name: string) {
    return this.query?.[name] as T;
  }

  filter(filter: Record<string, string | number>) {
    return this.link({
      filter:
        Object.entries(filter || {})
          .map(([k, v]) => (!(k && v) ? null : `${k}=${v}`))
          .filter(Boolean)
          .join('|') || null,
    });
  }
}

export const PageQuery = createParamDecorator((data: void, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as AppRequest;
  return new QueryBuilder(request?.translation?.link?.(request.path) || request.path, request.query || {});
});
