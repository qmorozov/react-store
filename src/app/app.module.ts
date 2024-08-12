import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MainModule } from '../main/main.module';
import { CatalogModule } from '../catalog/catalog.module';
import { RenderModule } from './render/render.module';
import { AuthModule } from '../auth/auth.module';
import { ProductModule } from '../product/product.module';
import { CartModule } from '../cart/cart.module';
import { SavedModule } from '../saved/saved.module';
import { PricingModule } from '../pricing/pricing.module';
import { FaqModule } from '../faq/faq.module';
import { BlogModule } from '../blog/blog.module';
import { CompanyModule } from '../company/company.module';
import { NotFoundModule } from '../notFound/notFound.module';
import { ChatsModule } from '../chats/chats.module';
import { ServeStaticConfiguration } from './services/serve-static.configuration';
import { DatabaseModule } from './database/database.module';
import { Database } from './database/database.enum';
import { UserModule } from '../user/user.module';
import { LanguageMiddleware } from './language/language.middleware';
import { PageModule } from '../page/page.module';
import { AdminModule } from '../admin/admin.module';
import { ShopModule } from '../shop/shop.module';
import { PaymentModule } from '../payment/payment.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { StorageModule } from '../storage/storage.module';
import { FeedModule } from '../feed/client/feed.module';
import { ProfileModule } from '../profile/profile.module';
import { ReviewsModule } from '../reviews/reviews.module';
import { SharedModule } from './shared/shared.module';
import { JwtModule } from '@nestjs/jwt';
import environment from './configuration/configuration.env';
import { MailerModule } from '@nestjs-modules/mailer';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { AssetMode } from './configuration/asset-mode.enum';

const fileServing = environment.fileServing.enabled || environment.asset.mode === AssetMode.Development;

@Module({
  imports: [
    JwtModule.register({
      secret: environment.jwt.secret,
      signOptions: { expiresIn: `${environment.jwt.expiresIn}s` },
    }),
    fileServing ? ServeStaticConfiguration.for('ui') : undefined,
    fileServing ? ServeStaticConfiguration.for('public') : undefined,
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: environment.mailer.user,
          pass: environment.mailer.pass,
        },
      },
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 100,
      },
    ]),
    ScheduleModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
    }),
    environment.redis.enabled
      ? BullModule.forRoot({
          redis: {
            host: environment.redis.host,
            port: environment.redis.port,
            password: environment.redis.password,
            db: environment.redis.db,
          },
        })
      : undefined,
    DatabaseModule.forRoot(Database.Main),
    SharedModule,
    RenderModule,
    MainModule,
    CatalogModule,
    AuthModule,
    ProductModule,
    CartModule,
    SavedModule,
    PricingModule,
    FaqModule,
    BlogModule,
    CompanyModule,
    NotFoundModule,
    UserModule,
    ShopModule,
    ChatsModule,
    PageModule,
    AdminModule,
    PaymentModule,
    StorageModule,
    FeedModule,
    ProfileModule,
    ReviewsModule,
  ].filter(Boolean),
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LanguageMiddleware).forRoutes('/');
  }
}
