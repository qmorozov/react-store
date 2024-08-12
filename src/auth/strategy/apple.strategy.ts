// @Injectable()
// export class AppleStrategy extends PassportStrategy(Strategy, UserSocialType.Apple) {
//   constructor(
//     private readonly authService: AuthService,
//     private readonly usersService: UsersService,
//   ) {
//     console.log(environment.oauth[UserSocialType.Apple].privateKey);
//     super({
//       clientID: environment.oauth[UserSocialType.Apple].clientID,
//       teamID: environment.oauth[UserSocialType.Apple].teamID,
//       keyID: environment.oauth[UserSocialType.Apple].keyID,
//       keyFilePath: environment.oauth[UserSocialType.Apple].privateKey,
//       callbackURL: `${environment.href}/${AuthRoute.apiUrl('oauth')}/${UserSocialType.Apple}/callback`,
//     });
//   }
//
//   async validate(req: Request, accessToken, refreshToken, profile): Promise<any> {
//     console.log({
//       accessToken,
//       refreshToken,
//       profile,
//     });
//     let user: User;
//
//     if (profile?.id) {
//       user = await this.authService.userFromSocial(profile.id, UserSocialType.Apple).catch(() => null);
//
//       if (!user) {
//         user = await this.register(profile);
//       }
//     }
//
//     return user;
//   }
//
//   private async register(profile: Profile): Promise<User | null> {
//     const email =
//       ((profile.emails || []).filter((e) => e.verified) || [])?.[0]?.value ||
//       `${profile.id}@social.${UserSocialType.Apple}`;
//
//     const user = (await this.findExistingUser(email)) || (await this.createUser(profile, email));
//
//     if (user) {
//       return this.attachSocial(user, profile).then(() => user);
//     }
//
//     return null;
//   }
//
//   private async findExistingUser(email?: string) {
//     if (!email?.length) {
//       return null;
//     }
//     return this.usersService.findByEmail(email);
//   }
//
//   private async createUser(profile: Profile, email: string) {
//     const user = new User();
//     user.email = email;
//     user.password = await this.authService.hashPassword(new ShortUniqueId().rnd(16));
//     user.firstName = profile.name.givenName;
//     user.lastName = profile.name.familyName;
//     user.status = 1;
//     return this.usersService.save(user);
//   }
//
//   private async attachSocial(user: User, profile: Profile) {
//     const social = new UserSocial();
//     social.user = user;
//     social.type = UserSocialType.Apple;
//     social.socialId = profile.id;
//     return this.authService.saveSocial(social);
//   }
// }
