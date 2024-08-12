import { Module } from '@nestjs/common';
import { ChatsController } from './controller/chats.controller';
import { ChatsApiController } from './controller/chats.api.controller';
import { ChatsAdminApiController } from './controller/chats.admin.api.controller';

@Module({
  controllers: [ChatsController, ChatsApiController, ChatsAdminApiController],
})
export class ChatsModule {}
