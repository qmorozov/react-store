import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Database } from '../../app/database/database.enum';
import { Repository } from 'typeorm';
import { ProductAttributes } from '../models/ProductAttributes';
import { ProductType } from '../models/ProductType.enum';

@Injectable()
export class ProductAttributesService {
  private productAttributes: ProductAttributes[] = [];

  private productAttributesByProductType: Record<ProductType, Record<string, ProductAttributes[]>>;

  constructor(
    @InjectRepository(ProductAttributes, Database.Main)
    private productAttributesRepository: Repository<ProductAttributes>,
  ) {}

  private emptyProductAttributesByProductType() {
    return (this.productAttributesByProductType = Object.values(ProductType).reduce((a, c) => {
      a[c] = {};
      return a;
    }, {} as ProductAttributesService['productAttributesByProductType']));
  }

  public async getProductAttributes() {
    if (!this.productAttributes.length) {
      this.productAttributes = await this.productAttributesRepository.find();
      this.productAttributesByProductType = this.productAttributes.reduce((a, c) => {
        a[c.productType as ProductType] = a[c.productType as ProductType] || {};
        a[c.productType as ProductType][c.attribute] = a[c.productType as ProductType][c.attribute] || [];
        a[c.productType as ProductType][c.attribute].push(c);
        return a;
      }, this.emptyProductAttributesByProductType());
    }
    return this.productAttributes;
  }

  public async getProductAttributesByProductType(productType?: ProductType) {
    await this.getProductAttributes();
    return (productType && this.productAttributesByProductType[productType]) || {};
  }

  public async getProductAttributesValuesByProductType(productType: ProductType) {
    const attributes = await this.getProductAttributesByProductType(productType);
    return Object.entries(attributes).reduce((a, [type, att]) => {
      a[type] = att.map((a) => a.value);
      return a;
    }, {} as Record<string, string[]>);
  }

  async save(item: ProductAttributes) {
    return this.productAttributesRepository.save(item).then((i) => {
      this.productAttributes = [];
      return i;
    });
  }

  async getProductAttributesById(id: number) {
    return this.productAttributesRepository.findOne({
      where: {
        id,
      },
    });
  }

  async deleteProductAttributesById(id: number) {
    return this.productAttributesRepository
      .delete(id)
      .then((res) => !!res.affected)
      .catch(() => false)
      .then((res) => {
        this.productAttributes = [];
        return res;
      });
  }
}
