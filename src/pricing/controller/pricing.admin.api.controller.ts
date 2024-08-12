import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Put } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { ProtectedAdminController } from '../../admin/controller/ProtectedAdminController.abstract';
import { Route } from '../../app/router/route';
import { PlansService } from '../service/plans.service';
import { PricingCreateDto } from '../dto/Plan.create.schema';
import { PricingPlan } from '../models/PricingPlan';

@Controller(ProtectedAdminController.apiPath('pricing'))
@ApiTags(...Route.AdminTags('Pricing'))
export class PricingAdminApiController extends ProtectedAdminController {
  constructor(private readonly plansService: PlansService) {
    super();
  }

  @Get()
  async getList() {
    return this.plansService.getPlansList();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  async getOne(@Param('id') id: number) {
    return this.plansService.getPlan(id);
  }

  @Post()
  @ApiBody({
    schema: PricingCreateDto,
  })
  async create(@Body() body: PricingPlan) {
    const item = PricingPlan.fromJson(body);
    item.active = false;
    return this.plansService.savePlan(item);
  }

  @Put(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  @ApiBody({
    schema: PricingCreateDto,
  })
  async update(@Param('id') id: number, @Body() body: PricingPlan) {
    const item = await this.plansService.getPlan(id);

    if (!item) {
      throw new NotFoundException();
    }

    item.fromJson(body);
    return this.plansService.savePlan(item);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: 'number',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        active: {
          type: 'boolean',
        },
      },
    },
  })
  async updateProperty(@Param('id') id: number, @Body() body: { active?: boolean }) {
    const item = await this.plansService.getPlan(id);

    if (!item) {
      throw new NotFoundException();
    }

    const bKeys = Object.keys(body);

    ['active'].forEach((key) => {
      if (bKeys.includes(key)) {
        item[key] = body[key];
      }
    });

    return this.plansService.savePlan(item);
  }
}
