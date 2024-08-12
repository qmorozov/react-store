import { Module } from '@nestjs/common';
import { PricingController } from './controller/pricing.controller';
import { PricingApiController } from './controller/pricing.api.controller';
import { PricingAdminApiController } from './controller/pricing.admin.api.controller';

@Module({
  controllers: [PricingController, PricingApiController, PricingAdminApiController],
})
export class PricingModule {}
