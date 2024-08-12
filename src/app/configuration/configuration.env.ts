import { config } from 'dotenv';
import { join } from 'path';
import { EnvConfig } from './env-config.abstract';
import { AssetMode } from './asset-mode.enum';
import { StorageKey } from '../../storage/model/StorageKey';
import { StorageConfig } from '../../storage/model/StorageConfig';
import { ProductStatus } from '../../product/models/Product.status.enum';
import { ReviewStatus } from '../../cart/model/ReviewStatus.enum';
import { UserSocialType } from '../../auth/models/UserSocial';

config({
  path: join(__dirname, '..', '..', '..', '..', '.env'),
});

class Environment extends EnvConfig {
  production = this.bool('PRODUCTION', true);

  swagger = this.bool('SWAGGER', !this.production);

  server = {
    port: this.number('PORT', 3000),
    host: this.string('HOST', 'localhost'),
    hostPort: this.number('HOST_PORT', 0),
    protocol: this.string('PROTOCOL', 'http'),
  };

  fileServing = {
    enabled: this.bool('FILE_SERVING_ENABLED', false),
  };

  root = join(__dirname, '..', '..', '..', '..');

  private hostPort = this.server.hostPort && ![80, 0].includes(this.server.hostPort) ? this.server.hostPort : 0;
  href = `${this.server.protocol}://${this.server.host}${this.hostPort ? `:${this.hostPort}` : ''}`;

  asset = {
    mode: this.enum('ASSET_MODE', AssetMode, AssetMode.Static),
  };

  jwt = {
    secret: this.string('JWT_SECRET', 'dc5a1f6e8370834ccf249052fe48d14353bffb59'),
    expiresIn: this.number('JWT_EXPIRES_IN_SECONDS', 60 * 20),
    refreshSecret: this.string('JWT_REFRESH_SECRET', '7e5441863edd6249a4730e07eb465ecc95eb0c19'),
    refreshExpiresIn: this.number('JWT_REFRESH_EXPIRES_IN_DAYS', 7),
  };

  saltRounds: number = this.number('SALT_ROUNDS', 10);

  cookie = {
    secret: this.string('COOKIE_SECRET', 'a47b16e1462a3a8b6d4d7ae33f1a7a899327f2cb'),
  };

  database = {
    type: this.string('DB_MAIN_TYPE', 'mysql'),
    host: this.string('DB_MAIN_HOST', 'localhost'),
    port: this.number('DB_MAIN_PORT', 3306),
    username: this.string('DB_MAIN_USERNAME', ''),
    password: this.string('DB_MAIN_PASSWORD', ''),
    database: this.string('DB_MAIN_DATABASE', ''),
  };

  redis = {
    enabled: this.bool('REDIS_ENABLED', true),
    username: this.string('REDIS_USERNAME', ''),
    password: this.string('REDIS_PASSWORD', ''),
    host: this.string('REDIS_HOST', 'localhost'),
    port: this.number('REDIS_PORT', 6379),
    db: this.number('REDIS_DB', 0),
  };

  stripe = {
    secretKey: this.string('STRIPE_SECRET_KEY', ''),
    publishableKey: this.string('STRIPE_PUBLISHABLE_KEY', ''),
  };

  storage: Record<StorageKey, StorageConfig> = {
    [StorageKey.Main]: {
      forcePathStyle: this.bool('STORAGE_MAIN_FORCE_PATH_STYLE', false),
      endpoint: this.string('STORAGE_MAIN_ENDPOINT', ''),
      region: this.string('STORAGE_MAIN_REGION', ''),
      accessKeyId: this.string('STORAGE_MAIN_ACCESS_KEY_ID', ''),
      secretAccessKey: this.string('STORAGE_MAIN_SECRET_ACCESS_KEY', ''),
    },
  };

  product = {
    showStatus: this.number('PRODUCT_SHOW_STATUS', ProductStatus.Published),
    defaultApproved: this.bool('PRODUCT_DEFAULT_APPROVED', true),
  };

  pagination = {
    radius: this.number('PAGINATION_RADIUS', 3),
    onPage: this.number('PAGINATION_ON_PAGE', 20),
    catalog: {
      onPage: this.number('PAGINATION_CATALOG_ON_PAGE', 20),
    },
  };

  image = {
    shopLogo: {
      width: this.number('IMAGE_SHOP_LOGO_WIDTH', 200),
      height: this.number('IMAGE_SHOP_LOGO_HEIGHT', 200),
    },
    productImage: {
      small: {
        width: this.number('IMAGE_PRODUCT_IMAGE_SMALL_WIDTH', 232),
        height: this.number('IMAGE_PRODUCT_IMAGE_SMALL_HEIGHT', 232),
      },
      medium: {
        width: this.number('IMAGE_PRODUCT_IMAGE_MEDIUM_WIDTH', 464),
        height: this.number('IMAGE_PRODUCT_IMAGE_MEDIUM_HEIGHT', 464),
      },
      large: {
        width: this.number('IMAGE_PRODUCT_IMAGE_LARGE_WIDTH', 928),
        height: this.number('IMAGE_PRODUCT_IMAGE_LARGE_HEIGHT', 928),
      },
    },
    blog: {
      main: {
        width: this.number('IMAGE_BLOG_MAIN_WIDTH', 600),
        height: this.number('IMAGE_BLOG_MAIN_HEIGHT', 600),
      },
      content: {
        width: this.number('IMAGE_BLOG_CONTENT_WIDTH', 1185),
        height: this.number('IMAGE_BLOG_CONTENT_HEIGHT', 1185),
      },
    },
    landingSlide: {
      width: this.number('IMAGE_LANDING_SLIDE_WIDTH', 1824),
      height: this.number('IMAGE_LANDING_SLIDE_HEIGHT', 412),
    },
    brand: {
      width: this.number('IMAGE_BRAND_WIDTH', 200),
      height: this.number('IMAGE_BRAND_HEIGHT', 200),
    },
    message: {
      width: this.number('IMAGE_MESSAGE_WIDTH', 1080),
      height: this.number('IMAGE_MESSAGE_HEIGHT', 1080),
    },
  };

  suggestPrice = {
    lifeTimeInHours: this.number('SUGGEST_PRICE_LIFE_TIME_IN_HOURS', 24 * 3),
  };

  mailer = {
    user: this.string('MAILER_USER', ''),
    pass: this.string('MAILER_PASS', ''),
  };

  mailtrap = {
    endpoint: this.string('MAILTRAP_ENDPOINT', 'https://send.api.mailtrap.io/'),
    token: this.string('MAILTRAP_TOKEN', ''),
    sender: {
      email: this.string('MAILTRAP_SENDER_EMAIL', 'noreply@qmorozov.com'),
      name: this.string('MAILTRAP_SENDER_NAME', 'qmorozov'),
    },
  };

  cache = {
    long: this.number('CACHE_LONG', 1000 * 60 * 10), // 10 minutes
  };

  readonly oauth = {
    [UserSocialType.Google]: {
      clientID: this.string('OAUTH_GOOGLE_CLIENT_ID', ''),
      clientSecret: this.string('OAUTH_GOOGLE_CLIENT_SECRET', ''),
    },
    [UserSocialType.Facebook]: {
      clientID: this.string('OAUTH_FACEBOOK_CLIENT_ID', ''),
      clientSecret: this.string('OAUTH_FACEBOOK_CLIENT_SECRET', ''),
    },
    // [UserSocialType.Apple]: {
    //   clientID: this.string('OAUTH_APPLE_CLIENT_ID', ''),
    //   teamID: this.string('OAUTH_APPLE_TEAM_ID', ''),
    //   keyID: this.string('OAUTH_APPLE_KEY_ID', ''),
    //   privateKey: this.path('OAUTH_APPLE_PRIVATE_KEY', ''),
    // },
  } as const;

  reviews = {
    commentMaxLength: this.number('REVIEWS_COMMENT_MAX_LENGTH', 500),
    defaultStatus: ReviewStatus.Approved,
  };
}

export const environment = new Environment();

export default environment;
