import { ChildEntity, OneToOne } from 'typeorm';
import { Product } from '../Product.abstract';
import { ProductType } from '../ProductType.enum';
import { LabGrownDiamondsAttributes } from './lab-grown-diamonds.attributes';

@ChildEntity(ProductType.LabGrownDiamond)
export class LabGrownDiamond extends Product<LabGrownDiamondsAttributes> {
  static readonly attributesEntity = LabGrownDiamondsAttributes;

  @OneToOne(() => LabGrownDiamond.attributesEntity, (attributes) => attributes.product)
  attributes: (typeof LabGrownDiamond)['attributesEntity'];
}
