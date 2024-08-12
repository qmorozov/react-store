import { AdminOnly } from '../../auth/decorator/auth.decorators';
import { Route } from '../../app/router/route';

@AdminOnly()
export abstract class ProtectedAdminController {
  static apiPath<T extends string | number>(url?: T | T[]): string {
    return (
      '/' + [Route.apiNamespace, Route.adminNamespace, ...(Array.isArray(url) ? url : [url])].filter(Boolean).join('/')
    );
  }
}
