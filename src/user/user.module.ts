import { Module } from '@nestjs/common';
import { DatabaseModule } from '../app/database/database.module';
import { User } from './models/User';
import { ResetPassword } from './models/ResetPassword';
import { UserApiController } from './controller/user.api.controller';
import { UsersAdminApiController } from './controller/users.admin.api.controller';

@Module({
  imports: [DatabaseModule.forFeature([User, ResetPassword])],
  controllers: [UserApiController, UsersAdminApiController],
})
export class UserModule {}
