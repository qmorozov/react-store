import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { User } from '../../user/models/User';
import { UsersService } from '../../user/service/users.service';
import environment from '../../app/configuration/configuration.env';
import { CurrentUser } from '../models/CurrentUser';
import { Request, Response } from 'express';
import { CookieService } from '../../app/services/cookie.service';
import { browserName, Session } from '../models/Session';
import { SessionService } from './session.service';
import { AppRequest, AppResponse } from '../../app/models/request';
import { ShopService } from '../../shop/service/shop.service';
import { OwnerInfo } from '../../product/models/OwnerInfo';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { Repository } from 'typeorm';
import { UserSocial, UserSocialType } from '../models/UserSocial';

@Injectable()
export class AuthService {
  public static readonly accessTokenName = 'jat' as const;

  public static readonly refreshTokenName = 'jrt' as const;

  async hashPassword(password: string) {
    return bcrypt.hash(password, environment.saltRounds);
  }

  constructor(
    @InjectRepository(UserSocial, Database.Main)
    protected userSocialRepository: Repository<UserSocial>,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly shopService: ShopService,
    private readonly sessionService: SessionService,
  ) {}

  private isActivated(user: User) {
    return user?.status === 1 && user?.verificationCode === null;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(
      email,
      User.select({
        status: true,
        verificationCode: true,
        password: true,
        role: true,
        currency: true,
        image: true,
        rating: true,
      }),
    );

    return !!user && this.isActivated(user) && (await bcrypt.compare(password, user.password)) ? user : null;
  }

  async accessToken(user: User) {
    const payload = CurrentUser.from(user);
    payload.shops = ((await this.shopService.userShops(user.id).catch(() => [])) || [])
      .map((s) => {
        const shop = OwnerInfo.from(s);
        shop.isOnline = true;
        return shop;
      })
      .filter(Boolean);
    return this.jwtService.sign(
      { payload, sub: user.id },
      {
        secret: environment.jwt.secret,
        expiresIn: `${environment.jwt.expiresIn}s`,
      },
    );
  }

  async refreshToken(user: User) {
    return this.jwtService.sign(
      { sub: user.id },
      {
        secret: environment.jwt.refreshSecret,
        expiresIn: `${environment.jwt.refreshExpiresIn}d`,
      },
    );
  }

  async makeSession(user: User, request: Request, response: Response, refreshTokenSession?: Session) {
    CookieService.send(response, AuthService.accessTokenName, await this.accessToken(user), {
      maxAge: 1000 * environment.jwt.expiresIn,
    });

    if (!refreshTokenSession) {
      refreshTokenSession = Session.fromJson({
        deviceName: browserName(request.header('user-agent')),
        maxAge: 1000 * 60 * 60 * 24 * environment.jwt.refreshExpiresIn,
      });
      refreshTokenSession.user = user;
    }

    refreshTokenSession.refreshToken = await this.refreshToken(user);

    await this.sessionService.save(refreshTokenSession);

    CookieService.send(response, AuthService.refreshTokenName, refreshTokenSession.refreshToken, {
      maxAge: refreshTokenSession.maxAge,
    });

    return user.toJson() as CurrentUser;
  }

  async makeSessionAndSend(data: any, user: User, request: Request, response: Response) {
    return this.makeSession(user, request, response).then(() => response.send(data));
  }

  async getSessionByRefreshToken(refreshToken: string) {
    return this.sessionService.getByJwt(refreshToken);
  }

  async verifyRefreshToken(token: string) {
    return (
      token &&
      this.jwtService.verifyAsync(token, {
        secret: environment.jwt.refreshSecret,
      })
    );
  }

  async verifyAccessToken(token: string) {
    return (
      token &&
      this.jwtService.verifyAsync(token, {
        secret: environment.jwt.secret,
      })
    );
  }

  async deleteSession(request: AppRequest, response: AppResponse) {
    const refreshToken = CookieService.get(request, AuthService.refreshTokenName);
    if (refreshToken) {
      await this.sessionService.deleteByJwt(refreshToken);
    }
    CookieService.clear(response, AuthService.accessTokenName);
    CookieService.clear(response, AuthService.refreshTokenName);
  }

  async userFromSocial(socialId: string, type: UserSocialType) {
    return this.userSocialRepository
      .findOne({
        where: {
          type,
          socialId,
        },
        relations: ['user'],
      })
      .then((res) => res?.user);
  }

  async saveSocial(social: UserSocial) {
    return this.userSocialRepository.save(social);
  }
}
