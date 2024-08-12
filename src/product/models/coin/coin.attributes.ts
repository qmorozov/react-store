import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Coin } from './Coin';
import { Model } from '../../../app/models/entity-helper';
import TableName from '../../../app/database/tables.json';

@Entity({
  name: TableName.ProductAttributesCoin,
})
export class CoinAttributes extends Model {
  protected static fillable = [
    'material',
    'theme',
    'par',
    'origin',
    'state',
    'peculiarities',
    'circulation',
    'denomination',
    'collection',
    'certificate',
    'stateReward',
    'comesWithPacking',
    'size',
    'packingMaterial',
    'packingSize',
  ];
  protected static public = CoinAttributes.fillable;

  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Coin, (coin) => coin.attributes)
  @JoinColumn()
  product: Coin;

  @Column()
  productId: number;

  @Column()
  material: string;

  @Column()
  theme: string;

  @Column()
  par: string;

  @Column()
  origin: string;

  @Column()
  state: string;

  @Column()
  peculiarities: string;

  @Column()
  circulation: string;

  @Column()
  denomination: string;

  @Column()
  collection: string;

  @Column()
  certificate: string;

  @Column()
  stateReward: boolean;

  @Column()
  comesWithPacking: boolean;

  @Column()
  size: string;

  @Column()
  packingMaterial: string;

  @Column()
  packingSize: string;
}
