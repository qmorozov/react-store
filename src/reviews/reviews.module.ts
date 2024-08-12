import { Module } from '@nestjs/common';
import { ReviewsController } from './controller/reviews.controller';
import { ReviewsApiController } from './controller/reviews.api.controller';

@Module({
  controllers: [ReviewsController, ReviewsApiController],
})
export class ReviewsModule {}
