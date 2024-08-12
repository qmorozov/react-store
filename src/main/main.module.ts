import { Module } from '@nestjs/common';
import { MainController } from './controller/main.controller';
import { MainAdminController } from './controller/main.admin.controller';
import { BannerService } from './service/Banner.service';
import { DatabaseModule } from '../app/database/database.module';
import { BannerSlide } from './model/banner-slide';
import { Database } from '../app/database/database.enum';

@Module({
  imports: [DatabaseModule.forFeature([BannerSlide], Database.Main)],
  providers: [BannerService],
  controllers: [MainController, MainAdminController],
})
export class MainModule {}
