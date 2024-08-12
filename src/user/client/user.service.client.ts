import { coreInfo } from '../../app/client/helper.client';
import { Currency } from '../../payment/model/currency.enum';

export const CurrentUser = new (class CurrentUserInstance {
  public readonly email: string;

  public readonly firstName: string;

  public readonly lastName: string;

  public readonly role: number | null;

  public readonly currency: Currency = null;

  public readonly image: string | null;

  public readonly rating: number = 0;

  public readonly uuid: string;

  public readonly name: string;
  public readonly description: string | null;
  public readonly phone: number | null;
  public readonly link: string;

  public readonly shops: Array<any>;

  get signed(): boolean {
    return !!this?.email?.length;
  }

  constructor() {
    Object.assign(this, coreInfo<Record<string, any>>('user', {}));
  }
})();

export default CurrentUser;
