import { Global, Module } from '@nestjs/common';
import { LayoutsModule } from '../../layouts/layouts.module';

@Global()
@Module({
  imports: [LayoutsModule],
})
export class RenderModule {}
