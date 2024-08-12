import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../service/auth.service';
import environment from '../../app/configuration/configuration.env';
import { AuthRoute } from '../auth.router';
import { UserSocial, UserSocialType } from '../models/UserSocial';
import { User } from '../../user/models/User';
import ShortUniqueId from 'short-unique-id';
import { UsersService } from '../../user/service/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, UserSocialType.Google) {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({
      clientID: environment.oauth[UserSocialType.Google].clientID,
      clientSecret: environment.oauth[UserSocialType.Google].clientSecret,
      scope: ['email', 'profile'],
      callbackURL: `${environment.href}/${AuthRoute.apiUrl('oauth')}/${UserSocialType.Google}/callback`,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    let user: User;

    if (profile?.id) {
      user = await this.authService.userFromSocial(profile.id, UserSocialType.Google).catch(() => null);

      if (!user) {
        user = await this.register(profile);
      }
    }

    return user;
  }

  private async register(profile: Profile): Promise<User | null> {
    const email =
      ((profile.emails || []).filter((e) => e.verified) || [])?.[0]?.value ||
      `${profile.id}@social.${UserSocialType.Google}`;

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
    user.firstName = profile.name.givenName;
    user.lastName = profile.name.familyName;
    user.status = 1;
    return this.usersService.save(user);
  }

  private async attachSocial(user: User, profile: Profile) {
    const social = new UserSocial();
    social.user = user;
    social.type = UserSocialType.Google;
    social.socialId = profile.id;
    return this.authService.saveSocial(social);
  }
}
