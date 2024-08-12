import { Module } from '@nestjs/common';
import { CompanyController } from './controller/company.controller';

@Module({
  controllers: [CompanyController],
})
export class CompanyModule {}
