import { Controller, Get, Req, Res } from '@nestjs/common';
import { RenderService } from '../../app/render/render.service';
import { Page } from '../../pages';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { ApiType } from '../../app/models/api-type.enum';
import { AuthRoute, ResetPasswordRoute } from '../auth.router';
import { GetUser } from '../../user/decorator/current.user.decorator';
import { CurrentUser } from '../models/CurrentUser';
import { AuthService } from '../service/auth.service';
import { AppRequest } from '../../app/models/request';

@Controller(AuthRoute.controller)
export class AuthController {
  constructor(private readonly renderService: RenderService, private readonly authService: AuthService) {}

  @Get()
  @ApiTags(ApiType.Pages, Page.Auth)
  loginPage(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.Auth);
  }

  @Get(ResetPasswordRoute.path)
  @ApiTags(ApiType.Pages, Page.Auth)
  resetPasswordPage(@Res() response: Response) {
    return this.renderService.renderOnClient(response, Page.ResetPassword);
  }

  @Get('logout')
  @ApiTags(ApiType.Pages, Page.Auth)
  async logout(
    @Req() request: AppRequest,
    @Res({ passthrough: true }) response: Response,
    @GetUser() user: CurrentUser,
  ) {
    console.log('logout', user, request.signedCookies[AuthService.refreshTokenName]);
    // todo remove session by user id
    // todo in no user, remove session by refresh token
    // todo remove access token and refresh token from cookies
    // todo send redirect

    // await this.authService.logout();
    // return response.redirect('/');
  }
}
