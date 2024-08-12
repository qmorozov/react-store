import { Route } from '../app/router/route';

export class AuthRoute extends Route {
  static readonly controller = 'auth';
}

export class ResetPasswordRoute extends AuthRoute {
  static readonly path = `reset-password`;

  public entries = ['auth/client/resetPassword.client.tsx'];
}
