import { Global, MiddlewareConsumer, Module, NestModule, Provider } from '@nestjs/common';
import { AuthService } from '../../auth/service/auth.service';
import { SessionService } from '../../auth/service/session.service';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '../database/database.module';
import { CartService } from '../../cart/service/cart.service';
import { OrdersService } from '../../cart/service/orders.service';
import { ShopService } from '../../shop/service/shop.service';
import { Database } from '../database/database.enum';
import { ProductSharedService } from '../../product/service/product.shared.service';
import { SavedService } from '../../saved/service/saved.service';
import { UsersService } from '../../user/service/users.service';
import { ResetPasswordService } from '../../user/service/reset-password.service';
import { StorageService } from '../../storage/service/storage.service';
import { ImageUploadService } from '../../storage/service/image-upload.service';
import { ReviewsService } from '../../reviews/service/reviews.service';
import { FeedService } from '../../feed/service/feed.service';
import { FilterService } from '../../catalog/service/filter.service';
import { FaqService } from '../../faq/service/faq.service';
import { StaticPageService } from '../../page/service/static-page.service';
import { PaymentService } from '../../payment/service/payment.service';
import { PlansService } from '../../pricing/service/plans.service';
import { ProductService } from '../../product/service/product.service';
import { ProductAttributesService } from '../../product/service/product-attributes.service';
import { BrandsService } from '../../product/service/brands.service';
import { CategoryService } from '../../product/service/category.service';
import { layoutServices } from '../../layouts/layout.list';
import { RenderService } from '../render/render.service';
import { AuthMiddleware } from '../../auth/middleware/auth.middleware';
import { ShopMiddleware } from '../../shop/middleware/shop.middleware';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { ChatsService } from '../../chats/service/chats.service';
import { RedisService } from '../database/redis.service';
import { BlogService } from '../../blog/service/blog.service';
import { EmailService } from '../../email/service/email.service';
import { SiteMap, SiteMapProcessor } from '../services/SiteMap';
import { BullModule } from '@nestjs/bull';

const layouts = Object.values(layoutServices) as unknown as Provider<any>[];

const services = [
  JwtService,
  EmailService,
  AuthService,
  SessionService,
  CartService,
  OrdersService,
  ShopService,
  ProductSharedService,
  SavedService,
  UsersService,
  ResetPasswordService,
  StorageService,
  ImageUploadService,
  ReviewsService,
  FeedService,
  FilterService,
  FaqService,
  StaticPageService,
  PaymentService,
  PlansService,
  ProductService,
  ProductAttributesService,
  BrandsService,
  CategoryService,
  RenderService,
  ChatsService,
  RedisService,
  BlogService,
  SiteMap,
  SiteMapProcessor,
  ...layouts,
];

@Global()
@Module({
  imports: [
    DatabaseModule.forFeature(DatabaseModule.entities[Database.Main]),
    BullModule.registerQueue({
      name: 'sitemap',
    }),
  ],
  providers: [
    ...services,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: services,
})
export class SharedModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(AuthMiddleware, ShopMiddleware).forRoutes('/');
  }
}
