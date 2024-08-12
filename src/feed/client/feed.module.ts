import { Module } from '@nestjs/common';
import { FeedController } from '../controller/feed.controller';
import { FeedApiController } from '../controller/feed.api.controller';

@Module({
  controllers: [FeedController, FeedApiController],
})
export class FeedModule {}
