import { Module } from '@nestjs/common';
import { NotFoundController } from './controller/notFound.controller';

@Module({
  controllers: [NotFoundController],
})
export class NotFoundModule {}
