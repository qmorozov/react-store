import { Route } from '../app/router/route';

export class CompanyRoute extends Route {
  static readonly controller = 'company';

  entries = ['company/client/company.client.tsx'];
}

export class ContactRoute extends Route {
  static readonly controller = 'contact';
  entries = ['company/client/company.client.tsx'];
}
