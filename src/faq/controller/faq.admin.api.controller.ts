import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProtectedAdminController } from '../../admin/controller/ProtectedAdminController.abstract';
import { Route } from '../../app/router/route';
import { FaqService } from '../service/faq.service';
import { FaqCategory, FaqQuestion } from '../models/Faq';
import { Model } from '../../app/models/entity-helper';

@Controller(ProtectedAdminController.apiPath('faq'))
@ApiTags(...Route.AdminTags('Faq'))
export class FaqAdminApiController extends ProtectedAdminController {
  constructor(private readonly faqService: FaqService) {
    super();
  }

  @Get()
  async getList() {
    return this.faqService.getFaqQuestionsList();
  }

  @Get('categories')
  async getCategories() {
    return this.faqService.getFaqQuestionsCategoryList();
  }

  @Get('category/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async getCategory(@Param('id') id: number) {
    return this.faqService.getFaqQuestionsCategory(id);
  }

  @Post('category')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ...Model.langSchemaProperty('title'),
      },
    },
  })
  async createCategory(@Body() body: FaqCategory) {
    const faqCategory = FaqCategory.fromJson(body);
    return this.faqService.saveCategory(faqCategory);
  }

  @Put('category/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ...Model.langSchemaProperty('title'),
      },
    },
  })
  async updateCategory(@Param('id') id: number, @Body() body: FaqCategory) {
    const faqCategory = await this.faqService.getFaqQuestionsCategory(+id);

    if (!faqCategory) {
      throw new NotFoundException('Category not found');
    }

    faqCategory.fromJson(body);
    return this.faqService.saveCategory(faqCategory);
  }

  @Delete('category/:id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async deleteCategory(@Param('id') id: number) {
    return this.faqService.deleteCategory(id);
  }

  @Get(':id')
  async getItem(@Param('id') id: number) {
    return this.faqService.getFaqQuestion(+id);
  }

  @Post()
  @ApiBody({
    schema: {
      type: 'object',
      required: ['parentId', Model.withLang('title'), Model.withLang('answer')],
      properties: {
        parentId: {
          type: 'number',
        },
        ...Model.langSchemaProperty('title'),
        ...Model.langSchemaProperty('answer'),
      },
    },
  })
  async create(@Body() body: FaqQuestion & { parentId: number }) {
    const { parentId, ...rest } = body;
    const category = await this.faqService.getFaqQuestionsCategory(+parentId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const faqQuestion = FaqQuestion.fromJson(rest);
    faqQuestion.parentId = category.id;
    return this.faqService.saveQuestion(faqQuestion);
  }

  @Put(':id')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['parentId', Model.withLang('title'), Model.withLang('answer')],
      properties: {
        parentId: {
          type: 'number',
        },
        ...Model.langSchemaProperty('title'),
        ...Model.langSchemaProperty('answer'),
      },
    },
  })
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async update(@Param('id') id: number, @Body() body: FaqQuestion & { parentId: number }) {
    const { parentId, ...rest } = body;
    const category = await this.faqService.getFaqQuestionsCategory(+parentId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const faqQuestion = await this.faqService.getFaqQuestion(+id);

    if (!faqQuestion) {
      throw new NotFoundException('Question not found');
    }

    faqQuestion.fromJson(rest);
    faqQuestion.parentId = category.id;
    return this.faqService.saveQuestion(faqQuestion);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async delete(@Param('id') id: number) {
    return this.faqService.deleteQuestion(+id);
  }
}
