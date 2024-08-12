import { Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Page } from '../../pages';
import { AuthRoute } from '../auth.router';
import { LoginDto } from '../dto/login.dto';
import { DTO, sendValidationError } from '../../app/validation/validation.http';
import { LoginDtoValidator } from '../dto/login.dto.validation';
import { RegisterDto } from '../dto/register.dto';
import { RegisterDtoValidator } from '../dto/register.dto.validation';
import { AuthService } from '../service/auth.service';
import { Request, Response } from 'express';
import { UsersService } from '../../user/service/users.service';
import { User } from '../../user/models/User';
import { ForgotDto } from '../dto/forgot.dto';
import { ForgotDtoValidator } from '../dto/forgot.dto.validation';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { ResetPasswordService } from '../../user/service/reset-password.service';
import { ResetPasswordDtoValidator } from '../dto/reset-password.dto.validation';
import { AppRequest, AppResponse } from '../../app/models/request';
import { ApiType } from '../../app/models/api-type.enum';
import { EmailService } from '../../email/service/email.service';
import { Translation } from '../../app/language/language.decorator';
import { TranslationProviderServer } from '../../translation/translation.provider.server';
import ShortUniqueId from 'short-unique-id';
import environment from '../../app/configuration/configuration.env';
import { Throttle } from '@nestjs/throttler';

@Controller(AuthRoute.apiController)
export class AuthApiController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly email: EmailService,
  ) {}

  @Post('login')
  @Throttle({
    default: {
      limit: 3,
      ttl: 60000,
    },
  })
  @ApiTags(Page.Auth)
  @ApiBody({ type: LoginDto })
  async login(
    @DTO(LoginDtoValidator) loginDto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      return sendValidationError('password', 'auth.userNotFound');
    }

    return this.authService.makeSession(user, request, response);
  }

  @Post('register')
  @Throttle({
    default: {
      limit: 3,
      ttl: 60000,
    },
  })
  @ApiTags(Page.Auth)
  @ApiBody({ type: RegisterDto })
  async register(
    @DTO(RegisterDtoValidator) registerDto: RegisterDto,
    @Translation() translation: TranslationProviderServer,
    @Req() request: AppRequest,
  ) {
    const userWithSameEmail = await this.usersService.findByEmail(registerDto.email);

    if (userWithSameEmail) {
      return sendValidationError('email', 'register.userAlreadyExists');
    }

    const newUser = User.fromJson(registerDto);
    newUser.password = await this.authService.hashPassword(registerDto.password);
    newUser.verificationCode = new ShortUniqueId({ length: 16 }).rnd();

    const verifyUrl = this.getVerifyUrl(request, [AuthRoute.apiController, 'verify'].join('/'));

    verifyUrl.searchParams.set('token', newUser.verificationCode);

    return this.usersService
      .save(newUser)
      .then((user) => {
        return this.email.sendRegister(
          user.email,
          translation.get('email.register.subject', { name: user.firstName }),
          {
            verifyUrl: verifyUrl.toString(),
            name: user.firstName,
          },
        );
      })
      .then(() => true)
      .catch(() => false);
  }

  @Get(`/verify`)
  @Throttle({
    default: {
      limit: 3,
      ttl: 60000,
    },
  })
  @ApiTags(ApiType.Pages, Page.Auth)
  async verify(
    @Query('token') token: string,
    @Req() request: AppRequest,
    @Res({ passthrough: true }) response: AppResponse,
  ) {
    const user = await this.usersService.findByVerificationCode(token);

    if (user) {
      user.status = 1;
      user.verificationCode = null;
      await this.usersService.save(user);
      await this.authService.makeSession(user, request, response);
    }

    return response.redirect('/');
  }

  @Post('forgot-password')
  @Throttle({
    default: {
      limit: 3,
      ttl: 60000,
    },
  })
  @ApiTags(Page.Auth)
  @ApiBody({ type: ForgotDto })
  async forgot(
    @DTO(ForgotDtoValidator) forgotDto: ForgotDto,
    @Translation() translation: TranslationProviderServer,
    @Req() request: AppRequest,
  ) {
    const user = await this.usersService.findByEmail(forgotDto.email);
    return !user
      ? Promise.resolve()
      : this.resetPasswordService
          .resetForUser(user)
          .then((token) => {
            const verifyUrl = this.getVerifyUrl(request, [AuthRoute.link(), 'reset-password'].join('/'));
            verifyUrl.searchParams.set('token', token.token);
            return this.email.sendForgotPassword(
              user.email,
              translation.get('email.forgot-password.subject', { name: user.firstName }),
              {
                resetPasswordUrl: verifyUrl.toString(),
                name: user.firstName,
                email: user.email,
                supportEmail: environment.mailer.user,
              },
            );
          })
          .then(() => true)
          .catch((err) => {
            console.log('Forgot password error', err);
            return false;
          });
  }

  @Post('reset-password')
  @Throttle({
    default: {
      limit: 3,
      ttl: 60000,
    },
  })
  @ApiTags(Page.Auth)
  @ApiBody({ type: ResetPasswordDto })
  async reset(@DTO(ResetPasswordDtoValidator) { token, password }: ResetPasswordDto) {
    const resetPassword = await this.resetPasswordService.findByToken(token);

    if (!resetPassword?.user) {
      return sendValidationError('token', 'auth.invalidToken');
    }

    resetPassword.user.password = await this.authService.hashPassword(password);
    await this.usersService.save(resetPassword.user);
    await this.resetPasswordService.delete(resetPassword);

    return { status: 'ok' };
  }

  @Get('logout')
  @ApiTags(Page.Auth)
  async logout(@Req() request: AppRequest, @Res() response: AppResponse) {
    await this.authService.deleteSession(request, response);
    return response.redirect('/');
  }

  private getVerifyUrl(request: AppRequest, path: string) {
    return new URL(path, environment.href);
  }
}
