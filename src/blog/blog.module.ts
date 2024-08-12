import { Module } from '@nestjs/common';
import { BlogController } from './controller/blog.controller';
import { BlogAdminApiController } from './controller/blog.admin.api.controller';

@Module({
  imports: [],
  providers: [],
  controllers: [BlogController, BlogAdminApiController],
})
export class BlogModule {}
