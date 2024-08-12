import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
import { AuthService } from '../service/auth.service';
import environment from '../../app/configuration/configuration.env';
import { AuthRoute } from '../auth.router';
import { UserSocial, UserSocialType } from '../models/UserSocial';
import { User } from '../../user/models/User';
import ShortUniqueId from 'short-unique-id';
import { UsersService } from '../../user/service/users.service';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, UserSocialType.Facebook) {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: environment.oauth[UserSocialType.Facebook].clientID,
      clientSecret: environment.oauth[UserSocialType.Facebook].clientSecret,
      scope: ['email', 'public_profile'],
      callbackURL: `${environment.href}/${AuthRoute.apiUrl('oauth')}/${UserSocialType.Facebook}/callback`,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    let user: User;

    if (profile?.id) {
      user = await this.authService.userFromSocial(profile.id, UserSocialType.Facebook).catch(() => null);

      if (!user) {
        user = await this.register(profile);
      }
    }

    return user;
  }

  private async register(profile: Profile): Promise<User | null> {
    const email =
      (profile.emails || []).filter(Boolean)?.[0]?.value || `${profile.id}@social.${UserSocialType.Facebook}`;

    const user = (await this.findExistingUser(email)) || (await this.createUser(profile, email));

    if (user) {
      return this.attachSocial(user, profile).then(() => user);
    }

    return null;
  }

  private async findExistingUser(email?: string) {
    if (!email?.length) {
      return null;
    }
    return this.usersService.findByEmail(email);
  }

  private async createUser(profile: Profile, email: string) {
    const user = new User();
    user.email = email;
    user.password = await this.authService.hashPassword(new ShortUniqueId().rnd(16));
    user.firstName = profile.name?.givenName || profile.displayName;
    user.lastName = profile.name.familyName || null;
    user.status = 1;
    return this.usersService.save(user);
  }

  private async attachSocial(user: User, profile: Profile) {
    const social = new UserSocial();
    social.user = user;
    social.type = UserSocialType.Facebook;
    social.socialId = profile.id;
    return this.authService.saveSocial(social);
  }
}
