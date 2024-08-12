import { Injectable, Logger, Optional } from '@nestjs/common';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Queue } from 'bull';
import environment from '../configuration/configuration.env';
import { join } from 'path';
import { createWriteStream, WriteStream } from 'fs';
import { ArrayLinked, PromiseQueue } from './server.helper';
import { StaticPageService } from '../../page/service/static-page.service';
import { LanguageCode, TranslationProvider } from '../language/translation.provider';
import { CategoryService } from '../../product/service/category.service';
import { BrandsService } from '../../product/service/brands.service';
import { ProductService } from '../../product/service/product.service';
import { BlogService } from '../../blog/service/blog.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SiteMap {
  private readonly log = new Logger(SiteMap.name);

  constructor(@Optional() @InjectQueue('sitemap') private sitemapQueue: Queue) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  refreshSiteMap() {
    if (environment.redis.enabled && this.sitemapQueue) {
      return this.sitemapQueue.add('refresh');
    } else {
      return this.log.warn('Redis is not enabled, sitemap will not be refreshed');
    }
  }
}

interface SiteMapPage {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

class XmlWriter {
  private readonly file: WriteStream;

  private readonly languages = TranslationProvider.availableLanguages();

  constructor(file: string) {
    this.file = createWriteStream(file);
  }

  async write(page: SiteMapPage) {
    return PromiseQueue(this.languages, async (lang) => {
      await this.writeLine('  <url>');
      await this.writeLine(
        `    <loc>${environment.href}${TranslationProvider.link(page.loc, lang as LanguageCode)}</loc>`,
      );
      if (page.lastmod) {
        await this.writeLine(`    <lastmod>${page.lastmod}</lastmod>`);
      }
      if (page.changefreq) {
        await this.writeLine(`    <changefreq>${page.changefreq}</changefreq>`);
      }
      if (page.priority) {
        await this.writeLine(`    <priority>${page.priority}</priority>`);
      }
      return this.writeLine('  </url>');
    });
  }

  private async writeHeader() {
    this.file.write('<?xml version="1.0" encoding="UTF-8"?>');
    return this.writeLine('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
  }

  private async writeLine(line: string) {
    return this.file.write(`\n${line}`);
  }

  async start() {
    return this.writeHeader();
  }

  async close() {
    await this.writeLine('</urlset>');
    return this.file.close();
  }
}

@Processor('sitemap')
export class SiteMapProcessor {
  private readonly log = new Logger(SiteMapProcessor.name);

  constructor(
    private readonly pageService: StaticPageService,
    private readonly categoryService: CategoryService,
    private readonly brandsService: BrandsService,
    private readonly productService: ProductService,
    private readonly blogService: BlogService,
  ) {}

  @Process('refresh')
  async refresh() {
    this.log.log('Sitemap refresh started');
    const sitemap = new XmlWriter(join(__dirname, '..', '..', '..', '..', 'public', 'sitemap.xml'));
    return PromiseQueue(
      [
        this.getMainPages,
        this.getPages,
        this.getCategories,
        this.getBrands,
        this.getProducts,
        this.getSellerPages,
        this.getBlogPosts,
      ],
      async (currentValue: () => Promise<SiteMapPage[]>) => {
        this.log.log(`${currentValue.name} started`);
        return (currentValue.call(this) as Promise<SiteMapPage[]>).then((pages) => {
          this.log.log(`${currentValue.name} returned ${pages.length} pages`);
          return PromiseQueue(pages, (page) => sitemap.write(page))
            .then(() => this.log.log(`${currentValue.name} finished`))
            .catch((e) => this.log.error(e, `${currentValue.name} failed`));
        });
      },
      sitemap.start(),
    ).finally(() => sitemap.close());
  }

  async getMainPages(): Promise<SiteMapPage[]> {
    return [
      {
        loc: `/`,
        changefreq: 'daily',
        priority: 1,
      },
      {
        loc: `/company`,
        changefreq: 'monthly',
        priority: 1,
      },
      {
        loc: `/contact`,
        changefreq: 'monthly',
        priority: 1,
      },
      {
        loc: `/faq`,
        changefreq: 'monthly',
        priority: 1,
      },
      {
        loc: `/pricing`,
        changefreq: 'monthly',
        priority: 1,
      },
    ];
  }

  async getPages(): Promise<SiteMapPage[]> {
    return this.pageService.getUrlsOfActivePages().then((res) =>
      res.map((page) => ({
        loc: page.link,
        changefreq: 'monthly',
        priority: 1,
      })),
    );
  }

  async getCategories(): Promise<SiteMapPage[]> {
    return this.categoryService.getMainCategories().then((categories) =>
      categories.map((category) => ({
        loc: category.link,
        changefreq: 'daily',
        priority: 1,
      })),
    );
  }

  async getBrands(): Promise<SiteMapPage[]> {
    return this.brandsService.getBrands().then((brands) =>
      brands.list().map((brand) => ({
        loc: brand.link,
        changefreq: 'daily',
        priority: 1,
      })),
    );
  }

  async getProducts(): Promise<SiteMapPage[]> {
    return this.productService.getActiveProductUrls().then((products) =>
      products.map((product) => ({
        loc: product.link,
        changefreq: 'daily',
        priority: 1,
      })),
    );
  }

  async getSellerPages(): Promise<SiteMapPage[]> {
    return this.productService.getActiveSellerUrls().then((sellers) =>
      sellers.flatMap((seller) => {
        return ['catalog', 'about'].map((l) => ({
          loc: `${seller}/${l}`,
          changefreq: 'daily',
          priority: 1,
        }));
      }),
    );
  }

  async getBlogPosts(): Promise<SiteMapPage[]> {
    const categories = new ArrayLinked('id', await this.blogService.getCategories().catch(() => []));
    return [
      {
        loc: `/blog`,
        changefreq: 'daily',
        priority: 1,
      },
      ...categories.list().map((category) => ({
        loc: `/blog/${category.url}`,
        changefreq: 'daily',
        priority: 1,
      })),
      ...(await this.blogService.getAllItems(true).catch(() => [])).map((p) => ({
        loc: `/blog/post/${p.url}`,
        changefreq: 'daily',
        priority: 1,
      })),
    ];
  }
}
