import { Module } from '@nestjs/common';
import { PageController } from './controller/page.controller';
import { PageApiAdminController } from './controller/page.api.admin.controller';

@Module({
  controllers: [PageController, PageApiAdminController],
})
export class PageModule {}
