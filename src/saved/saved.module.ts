import { Module } from '@nestjs/common';
import { SavedController } from './controller/saved.controller';
import { SavedApiController } from './controller/saved.api.controller';

@Module({
  controllers: [SavedController, SavedApiController],
})
export class SavedModule {}
