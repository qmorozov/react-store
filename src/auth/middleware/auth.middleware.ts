import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { AuthService } from '../service/auth.service';
import { CurrentUser } from '../models/CurrentUser';
import { AppRequest } from '../../app/models/request';
import { AppMiddleware } from '../../app/services/app-middleware';
import { CookieService } from '../../app/services/cookie.service';
import { ActionTargetKey } from '../../user/decorator/action.target.decorator';
import { UsersService } from '../../user/service/users.service';

@Injectable()
export class AuthMiddleware extends AppMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  async use(req: AppRequest, res: Response, next: NextFunction): Promise<ReturnType<NextFunction>> {
    if (this.canUse(req)) {
      if ((req.user = req.user || (await this.userFromAccessToken(req.signedCookies[AuthService.accessTokenName])))) {
        return this.trackUser(req, next);
      }

      CookieService.clear(res, AuthService.accessTokenName);

      req.user = await this.userFromRefreshToken(req.signedCookies[AuthService.refreshTokenName], req, res);

      if (!req.user) {
        CookieService.clear(res, AuthService.refreshTokenName);
      }

      return this.trackUser(req, next);
    } else return next();
  }

  private async trackUser(req: AppRequest, next: NextFunction) {
    if (req.user) {
      const uList = [
        ActionTargetKey.convert(req.user as any),
        ...(req.user?.shops || []).map((s) => ActionTargetKey.convert(s as any)),
      ];

      this.usersService.setIsOnline(...uList);
    }
    return next();
  }

  private async userFromAccessToken(jwt: string): Promise<CurrentUser | null> {
    const jwtPayload = await this.catchVerification(this.authService.verifyAccessToken(jwt));
    return (jwtPayload?.payload || null) as CurrentUser | null;
  }

  private async userFromRefreshToken(jwt: string, req: AppRequest, res: Response): Promise<CurrentUser | null> {
    const jwtPayload = await this.catchVerification(this.authService.verifyRefreshToken(jwt));
    const session = jwtPayload && (await this.authService.getSessionByRefreshToken(jwt));
    return session ? this.authService.makeSession(session.user, req, res, session) : null;
  }

  private async catchVerification(verification: Promise<any>) {
    return verification.catch((e) => {
      console.log('catchVerification', e);
    });
  }
}
