import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AppRequest } from '../../app/models/request';
import environment from '../../app/configuration/configuration.env';
import { Validate } from '../../app/validation/validator';

export class PaginationService {
  private _onPage: number = environment.pagination.onPage;
  private _count: number;
  private _radius: number = environment.pagination.radius;
  private _linkBuilder: (page) => string = (page) => `?page=${page}`;

  constructor(public page: number) {}

  public onPage(count: number) {
    this._onPage = count;
    return this;
  }

  public setCount(count: number) {
    this._count = count;
    return this;
  }

  public setRadius(radius: number) {
    this._radius = radius;
    return this;
  }

  public generate() {
    const pages = this.pages;
    const page = this.page || 0;
    const radius = this._radius || 3;
    const result = [];

    if (pages <= 1) {
      return result;
    }

    if (page - radius > 1) {
      result.push(this.pageInfo(1));
    }

    if (page - radius > 2) {
      result.push(this.pageInfo('...'));
    }

    for (let i = page - radius; i <= page + radius; i++) {
      if (i > 0 && i <= pages) {
        result.push(this.pageInfo(i));
      }
    }

    if (page + radius < pages - 1) {
      result.push(this.pageInfo('...'));
    }

    if (page + radius < pages) {
      result.push(this.pageInfo(pages));
    }

    return result;
  }

  toJson() {
    return {
      page: this.page,
      pages: this.pages,
      radius: this._radius,
    };
  }

  response<Of>(items: Of[]) {
    if (!isFinite(this._onPage)) {
      return items;
    }
    return {
      items,
      pagination: this.toJson(),
    };
  }

  get pages() {
    return Math.ceil(this._count / this._onPage);
  }

  get offset() {
    return isFinite(this._onPage) ? this._onPage * (this.page - 1) : undefined;
  }

  get limit() {
    return isFinite(this._onPage) ? this._onPage : undefined;
  }

  private pageInfo(page: number | string) {
    return {
      page,
      link: Validate.isNumber(page) ? this._linkBuilder(Number(page)) : null,
      current: page === this.page,
    };
  }

  setLink(builder: (page) => string) {
    this._linkBuilder = builder;
    return this;
  }
}

export const Pagination = createParamDecorator((data: void, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as AppRequest;
  return new PaginationService(Math.trunc(Number(request.query.page || '1')));
});
