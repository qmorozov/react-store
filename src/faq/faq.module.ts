import { Module } from '@nestjs/common';
import { FaqController } from './controller/faq.controller';
import { FaqApiController } from './controller/faq.api.controller';
import { FaqAdminApiController } from './controller/faq.admin.api.controller';

@Module({
  controllers: [FaqController, FaqApiController, FaqAdminApiController],
})
export class FaqModule {}
