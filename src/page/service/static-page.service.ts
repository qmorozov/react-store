import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { Repository } from 'typeorm';
import { StaticPage } from '../models/StaticPage';

@Injectable()
export class StaticPageService {
  constructor(@InjectRepository(StaticPage, Database.Main) private staticPageRepository: Repository<StaticPage>) {}

  async getActiveStaticPage(url: string) {
    return this.staticPageRepository.findOne({
      where: {
        url,
        status: true,
      },
    });
  }

  async getStaticPage(url: string) {
    return this.staticPageRepository.findOne({
      where: {
        url,
      },
    });
  }

  async getList(lang = 'en') {
    return this.staticPageRepository.find({
      select: {
        id: true,
        url: true,
        status: true,
        [`title_${lang}`]: true,
        [`content_${lang}`]: true,
      },
    });
  }

  async getUrlsOfActivePages() {
    return this.staticPageRepository.find({
      where: {
        status: true,
      },
      select: {
        url: true,
      },
    });
  }

  async getById(id: number) {
    if (!id) {
      return null;
    }
    return this.staticPageRepository.findOneBy({
      id,
    });
  }

  async save(page: StaticPage) {
    return this.staticPageRepository.save(page);
  }

  async delete(page: StaticPage) {
    return this.staticPageRepository.delete(page.id);
  }
}
