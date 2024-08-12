import { User } from '../../user/models/User';
import { OwnerInfo } from '../../product/models/OwnerInfo';

export class CurrentUser extends OwnerInfo implements Pick<User, 'email' | 'firstName' | 'lastName' | 'role'> {
  email: string;

  firstName: string;

  lastName: string;

  role: number | null;

  shops: OwnerInfo[];

  static from(user: User): CurrentUser {
    const info = Object.assign(new CurrentUser(), super.from(user));
    info.email = user.email;
    info.firstName = user.firstName;
    info.lastName = user.lastName;
    info.role = user.role;
    info.isOnline = true;
    return info;
  }
}
