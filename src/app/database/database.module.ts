import { DynamicModule, Logger } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import environment from '../configuration/configuration.env';
import { Database } from './database.enum';
import { Category } from '../../product/models/category.entity';
import { Session } from '../../auth/models/Session';
import { User } from '../../user/models/User';
import { ResetPassword } from '../../user/models/ResetPassword';
import { ProductEntities } from '../../product/models/ProductModelsByType';
import { StaticPage } from '../../page/models/StaticPage';
import { faqEntities } from '../../faq/models/Faq';
import { Brand } from '../../product/models/brand.entity';
import { BrandToCategory } from '../../product/models/brand-to-category.entity';
import { Shop } from '../../shop/models/Shop';
import { ShopToUser } from '../../shop/models/ShopToUser';
import { PricingPlan } from '../../pricing/models/PricingPlan';
import { Payment } from '../../payment/model/Payment';
import { PlanHistory } from '../../pricing/models/PlanHistory';
import { ProductCart } from '../../cart/model/ProductCart';
import { Order } from '../../cart/model/Order';
import { Review } from '../../reviews/model/Review';
import { BannerSlide } from '../../main/model/banner-slide';
import { Chat } from '../../chats/model/Chat';
import { ChatMessage } from '../../chats/model/ChatMessage';
import { BlogCategory } from '../../blog/model/BlogCategory';
import { BlogPost } from '../../blog/model/BlogPost';
import { UserSocial } from '../../auth/models/UserSocial';

export class DatabaseModule {
  static entities: Record<Database, EntityClassOrSchema[]> = {
    [Database.Main]: [
      Category,
      User,
      Session,
      ResetPassword,
      StaticPage,
      Brand,
      BrandToCategory,
      Shop,
      ShopToUser,
      PricingPlan,
      PlanHistory,
      ProductCart,
      Payment,
      Order,
      Review,
      BannerSlide,
      Chat,
      ChatMessage,
      BlogCategory,
      BlogPost,
      UserSocial,
      ...(ProductEntities || []),
      ...(faqEntities || []),
    ],
  };

  static forRoot(name: Database, settings: Partial<TypeOrmModuleOptions> = {}): DynamicModule {
    const db = {
      ...(settings || {}),
      ...(environment.database || {}),
      timezone: 'Z',
      name,
      //logging: true,
      entities: DatabaseModule.entities[name],
    };

    new Logger(DatabaseModule.name).log(`Database ${name} on ${db.host}:${db.port}`);
    return TypeOrmModule.forRoot(db as TypeOrmModuleOptions);
  }

  static forFeature<D extends keyof typeof DatabaseModule.entities>(
    entities: (typeof DatabaseModule)['entities'][D],
    database: Database = Database.Main,
  ): DynamicModule {
    entities.forEach((entity) => {
      if (!DatabaseModule.entities[database].includes(entity)) {
        throw Error(`Entity ${(entity as any).name} is not registered in database ${database}`);
      }
    });
    return TypeOrmModule.forFeature(entities, database);
  }
}
