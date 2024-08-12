import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

interface ServingRoute {
  rootPath: string;
  serveRoot?: string;
  serveStaticOptions?: Record<string, any>;
}

function getServingRoute(info: ServingRoute) {
  return Object.assign(
    {
      serveRoot: '/',
      serveStaticOptions: {
        index: false,
      },
    },
    info,
  );
}

export abstract class ServeStaticConfiguration {
  private static readonly routes = {
    ui: getServingRoute({
      rootPath: join(__dirname, '..', '..', '..', 'client', 'ui'),
      serveRoot: '/ui',
    }),
    public: getServingRoute({
      rootPath: join(__dirname, '..', '..', '..', '..', 'public'),
    }),
  } as const;

  static getRoutes() {
    return Object.values(ServeStaticConfiguration.routes).map((route) => route.serveRoot);
  }

  static for(route: keyof (typeof ServeStaticConfiguration)['routes']) {
    return ServeStaticModule.forRoot(ServeStaticConfiguration.routes[route]);
  }
}
