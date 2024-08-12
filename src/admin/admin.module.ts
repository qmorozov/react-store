import { Module } from '@nestjs/common';
import { AdminController } from './controller/admin.controller';

@Module({
  controllers: [AdminController],
})
export class AdminModule {}
