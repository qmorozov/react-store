import { Module } from '@nestjs/common';
import { ProfileController } from './controller/profile.controller';

@Module({
  controllers: [ProfileController],
})
export class ProfileModule {}
