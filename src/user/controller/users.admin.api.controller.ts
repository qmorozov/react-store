import { BadRequestException, Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProtectedAdminController } from '../../admin/controller/ProtectedAdminController.abstract';
import { Route } from '../../app/router/route';
import { UsersService } from '../service/users.service';
import { AuthService } from '../../auth/service/auth.service';
import { User } from '../models/User';

@Controller(ProtectedAdminController.apiPath('users'))
@ApiTags(...Route.AdminTags('Users'))
export class UsersAdminApiController extends ProtectedAdminController {
  constructor(private readonly userService: UsersService, private readonly authService: AuthService) {
    super();
  }

  @Get()
  async getList() {
    return this.userService.getList();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async getOne(@Param('id') id: number) {
    return this.userService.getUser(+id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        // status: {
        //   type: 'number',
        // },
        role: {
          type: 'number',
        },
      },
    },
  })
  async updateProperty(@Param('id') id: number, @Body() body: Partial<User>) {
    const item = await this.userService.getUser(+id);

    if (!item) {
      throw new BadRequestException('User not found');
    }

    const bKeys = Object.keys(body);
    ['status', 'role'].forEach((key) => {
      if (bKeys.includes(key)) {
        item[key] = body[key];
      }
    });

    return this.userService.save(item);
  }
}
