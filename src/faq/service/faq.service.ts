import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { IsNull, Not, Repository } from 'typeorm';
import { FaqCategory, FaqQuestion } from '../models/Faq';
import { LanguageCode } from '../../app/language/translation.provider';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(FaqCategory, Database.Main) private faqCategoriesRepository: Repository<FaqCategory>,
    @InjectRepository(FaqQuestion, Database.Main) private faqQuestionsRepository: Repository<FaqQuestion>,
  ) {}

  async saveCategory(faqCategory: FaqCategory) {
    return this.faqCategoriesRepository.save(faqCategory);
  }

  async saveQuestion(question: FaqQuestion) {
    return this.faqQuestionsRepository.save(question);
  }

  async getFaq() {
    return this.faqCategoriesRepository.find({
      where: {
        parentId: IsNull(),
      },
      relations: ['questions'],
    });
  }

  async getFaqQuestionsList() {
    return this.faqQuestionsRepository.find({
      where: {
        parent: {
          id: Not(IsNull()),
        },
      },
    });
  }

  async getFaqQuestionsCategoryList() {
    return this.faqCategoriesRepository.find({
      where: {
        parentId: IsNull(),
      },
    });
  }

  async getFaqPublic(language: LanguageCode) {
    const faqItems = (await this.getFaq()) || [];
    return faqItems.map((item) => {
      const questions = (item.questions || []).map((q) => q.setLanguage(language).toJson());
      const category = item.setLanguage(language).toJson();
      return {
        ...category,
        questions,
      };
    });
  }

  getFaqQuestionsCategory(id: number) {
    return this.faqCategoriesRepository.findOne({
      where: {
        id,
      },
    });
  }

  deleteCategory(id: number) {
    return this.faqCategoriesRepository
      .delete({
        id,
        parentId: IsNull(),
      })
      .then((res) => !!res.affected)
      .catch(() => false);
  }

  async getFaqQuestion(number: number) {
    return this.faqQuestionsRepository.findOne({
      where: {
        id: number,
      },
    });
  }

  async deleteQuestion(number: number) {
    return this.faqQuestionsRepository
      .delete({
        id: number,
        parentId: Not(IsNull()),
      })
      .then((res) => !!res.affected)
      .catch(() => false);
  }
}
