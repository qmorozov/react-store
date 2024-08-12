import { Controller, Delete, Get, Post, Put, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UserSignedOnly } from '../../auth/decorator/auth.decorators';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { DTO, onlyFilledFields, sendFormError } from '../../app/validation/validation.http';
import { updateUserDtoValidator } from '../dto/UpdateUser.dto.validator';
import { CurUser, GetUser } from '../decorator/current.user.decorator';
import { UsersService } from '../service/users.service';
import { AuthService } from '../../auth/service/auth.service';
import { Request } from 'express';
import { AppResponse } from '../../app/models/request';
import { FileInterceptor } from '@nestjs/platform-express';
import { CurrentUser as CurrentUserType } from '../../auth/models/CurrentUser';
import { ImageUploadService } from '../../storage/service/image-upload.service';
import { User } from '../models/User';

@Controller('api/user')
@ApiTags('user')
export class UserApiController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly imageUploadService: ImageUploadService,
  ) {}

  @Get()
  @UserSignedOnly()
  async get(@GetUser() userInfo: CurrentUserType) {
    const additionalData = (await this.userService.getAdditionalData(userInfo.id).catch(() => null)) || {};
    return {
      ...additionalData,
      ...userInfo,
    };
  }

  @Put()
  @ApiBody({ type: UpdateUserDto })
  @UserSignedOnly()
  async update(
    @DTO(updateUserDtoValidator) userDto: UpdateUserDto,
    @CurUser() userInfo: any,
    @Res({ passthrough: true }) response: AppResponse,
    @Req() request: Request,
  ) {
    const user = await this.userService.getUser(userInfo.id);

    const { currentPassword, email, newPassword, ...fillableData } = userDto;

    user.fromJson(onlyFilledFields(fillableData));

    if (currentPassword) {
      if (!(await this.authService.validateUser(user.email, currentPassword))) {
        return sendFormError('currentPassword', 'profile.wrongPassword');
      }

      if (email?.length) {
        user.email = email;
      }

      if (newPassword?.length) {
        user.password = await this.authService.hashPassword(newPassword);
      }
    }

    return this.saveUserAndUpdateSession(user, request, response);
  }

  private async saveUserAndUpdateSession(user: User, request: Request, response: AppResponse) {
    return this.userService.save(user).then((u) => {
      return this.authService.makeSession(u, request, response);
    });
  }

  @Post('logo')
  @UserSignedOnly()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadLogo(
    @GetUser() userInfo: CurrentUserType,
    @UploadedFile() file: Express.Multer.File,
    @Res({ passthrough: true }) response: AppResponse,
    @Req() request: Request,
  ) {
    const user = await this.userService.getUser(userInfo.id);
    return (
      user &&
      this.imageUploadService
        .uploadUserLogo(file)
        .then((url) => (user.image = url))
        .then(() => this.saveUserAndUpdateSession(user, request, response))
    );
  }

  @Delete('logo')
  @UserSignedOnly()
  async deleteLogo(
    @GetUser() userInfo: CurrentUserType,
    @Res({ passthrough: true }) response: AppResponse,
    @Req() request: Request,
  ) {
    const user = await this.userService.getUser(userInfo.id);
    user.image = null;
    return this.saveUserAndUpdateSession(user, request, response);
  }
}
