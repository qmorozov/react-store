import axios from 'axios';
import { Translations } from '../../translation/translation.provider.client';

class ApiRequest {
  constructor(public url: string) {}

  async post<Of>(body?: Of, params?: Of) {
    return axios({
      method: 'post',
      url: this.url,
      params,
      data: body || undefined,
    });
  }

  async get<Of>(params?: Of) {
    return axios({
      method: 'get',
      url: this.url,
      params,
    });
  }

  async put<Of>(body?: Of) {
    return axios({
      method: 'put',
      url: this.url,
      data: body,
    });
  }

  async patch<Of>(body?: Of) {
    return axios({
      method: 'patch',
      url: this.url,
      data: body,
    });
  }

  async delete<Of>(params?: Of) {
    return axios({
      method: 'delete',
      url: this.url,
      params,
    });
  }
}

export abstract class ApiService {
  private static prefix = Translations.link('/api');

  private static adminPrefix = [ApiService.prefix, 'admin'].join('/');

  protected static makeUrl(
    url: (string | number) | (string | number)[],
    query?: Record<string, any>,
    prefix = ApiService.prefix,
  ) {
    const params = new URLSearchParams(
      Object.entries(query || {}).reduce((q, [k, v]) => {
        if (v !== undefined) q[k] = v;
        return q;
      }, {}),
    )?.toString();
    return `${prefix}${Array.isArray(url) ? `/${url.join('/')}` : url}` + (params?.length ? `?${params}` : '');
  }

  protected static makeAdminUrl(url: (string | number) | (string | number)[], query?: Record<string, any>) {
    return ApiService.makeUrl(url, query, ApiService.adminPrefix);
  }

  private static request(prefix: string, url: string | string[], query?: Record<string, any>) {
    return new ApiRequest(this.makeUrl(url, query, prefix));
  }

  protected static url(url: Parameters<(typeof ApiService)['request']>[1], query?: Record<string, any>): ApiRequest {
    return this.request(ApiService.prefix, url, query);
  }

  protected static admin(url: Parameters<(typeof ApiService)['request']>[1], query?: Record<string, any>): ApiRequest {
    return this.request(this.adminPrefix, url, query);
  }
}
