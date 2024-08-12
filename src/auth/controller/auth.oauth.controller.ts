import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Page } from '../../pages';
import { AuthRoute } from '../auth.router';
import { AuthService } from '../service/auth.service';
import { UsersService } from '../../user/service/users.service';
import { AppRequest, AppResponse } from '../../app/models/request';
import { AuthGuard } from '@nestjs/passport';
import { UserSocialType } from '../models/UserSocial';
import { User } from '../../user/models/User';

@Controller(AuthRoute.apiUrl('oauth'))
export class AuthOauthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get(UserSocialType.Google)
  @UseGuards(AuthGuard(UserSocialType.Google))
  @ApiTags(Page.Auth)
  async googleRedirect(@Req() request: AppRequest, @Res({ passthrough: true }) response: AppResponse) {
    return response.redirect('/auth');
  }

  @Get(`${UserSocialType.Google}/callback`)
  @UseGuards(AuthGuard(UserSocialType.Google))
  @ApiTags(Page.Auth)
  async googleCallback(@Req() request: AppRequest, @Res({ passthrough: true }) response: AppResponse) {
    return this.authService
      .makeSession(request.user as unknown as User, request, response)
      .then(() => response.redirect('/'));
  }

  @Get(UserSocialType.Facebook)
  @UseGuards(AuthGuard(UserSocialType.Facebook))
  @ApiTags(Page.Auth)
  async facebookRedirect(@Req() request: AppRequest, @Res({ passthrough: true }) response: AppResponse) {
    return response.redirect('/auth');
  }

  @Get(`${UserSocialType.Facebook}/callback`)
  @UseGuards(AuthGuard(UserSocialType.Facebook))
  @ApiTags(Page.Auth)
  async facebookCallback(@Req() request: AppRequest, @Res({ passthrough: true }) response: AppResponse) {
    return this.authService
      .makeSession(request.user as unknown as User, request, response)
      .then(() => response.redirect('/'));
  }

  // @Get(UserSocialType.Apple)
  // @UseGuards(AuthGuard(UserSocialType.Apple))
  // @ApiTags(Page.Auth)
  // async appleRedirect(@Req() request: AppRequest, @Res({ passthrough: true }) response: AppResponse) {
  //   return response.redirect('/auth');
  // }
  //
  // @Post(`${UserSocialType.Apple}/callback`)
  // @UseGuards(AuthGuard(UserSocialType.Apple))
  // @ApiTags(Page.Auth)
  // async appleCallback(@Req() request: AppRequest, @Res({ passthrough: true }) response: AppResponse) {
  //   return this.authService
  //     .makeSession(request.user as unknown as User, request, response)
  //     .then(() => response.redirect('/'));
  // }
}
