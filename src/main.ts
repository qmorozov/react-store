import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { environment } from './app/configuration/configuration.env';
import { AssetMode } from './app/configuration/asset-mode.enum';
import { AppModule } from './app/app.module';
import devServer from './app/builder/client-dev-server';
import cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import { LoadTimeInterceptor } from './app/filters/load-time.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: environment.production ? ['error', 'warn', 'log'] : ['error', 'warn', 'debug'],
  });

  app.useGlobalInterceptors(new LoadTimeInterceptor());

  const logger = new Logger('App');

  if (environment.production || environment.asset.mode !== AssetMode.Development) {
    app.use(
      helmet({
        contentSecurityPolicy: false, // stripe, storage,
        crossOriginEmbedderPolicy: false,
      }),
    );
  } else {
    logger.warn(`[NOT FOR PRODUCTION] Using Vite dev server`);
    app.use((await devServer).middlewares);
  }

  if (environment.swagger) {
    const options = new DocumentBuilder().setTitle('qmorozov APIs').setVersion('1.0').build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
  }

  app.use(cookieParser(environment.cookie.secret));
  await app.listen(environment.server.port);

  logger.log(`MODE: ${environment.production ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  logger.log(`ASSETS: ${environment.asset.mode}, SERVING: ${environment.fileServing.enabled ? 'ENABLED' : 'DISABLED'}`);
  logger.log(`Server running on http://localhost:${environment.server.port} => ${environment.href}`);
}

bootstrap().catch((error) => console.error(error));
