import { ProductType } from './ProductType.enum';
import { Product } from './Product.abstract';
import { Watch } from './watch/Watch';
import { Coin } from './coin/Coin';
import { Bag } from './bag/Bag';
import { Belt } from './belt/Belt';
import { Bracelet } from './bracelet/Bracelet';
import { Glasses } from './glasses/Glasses';
import { Necklace } from './necklace/Necklace';
import { Ring } from './ring/Ring';
import { Wallet } from './wallet/Wallet';
import { ProductAttributes } from './ProductAttributes';
import { FavoriteProduct } from './FavoriteProduct';
import { NaturalDiamond } from './natural-diamonds/NaturalDiamond';
import { LabGrownDiamond } from './lab-grown-diamonds/LabGrownDiamond';
import { Earrings } from './earrings/Earrings';
import { JewellerySets } from './jewellery-sets/JewellerySets';
import { Pendants } from './pendants/Pendants';
import { PinsBrooches } from './PinsBrooches/PinsBrooches';
import { Pens } from './pens/Pens';
import { Cufflinks } from './cufflinks/Cufflinks';
import { BagCharms } from './bag-charms/BagCharms';
import { TieClip } from './tie-clip/TieClip';
import { KeyChain } from './key-chain/KeyChain';

const ProductModelsByTypeList = {
  [ProductType.Watch]: Watch,
  [ProductType.Coin]: Coin,
  [ProductType.Bag]: Bag,
  [ProductType.Belt]: Belt,
  [ProductType.Bracelet]: Bracelet,
  [ProductType.Glasses]: Glasses,
  [ProductType.Necklace]: Necklace,
  [ProductType.Ring]: Ring,
  [ProductType.Wallet]: Wallet,
  [ProductType.NaturalDiamond]: NaturalDiamond,
  [ProductType.LabGrownDiamond]: LabGrownDiamond,
  [ProductType.Earrings]: Earrings,
  [ProductType.JewellerySets]: JewellerySets,
  [ProductType.Pendants]: Pendants,
  [ProductType.PinsBrooches]: PinsBrooches,
  [ProductType.Pens]: Pens,
  [ProductType.Cufflinks]: Cufflinks,
  [ProductType.BagCharms]: BagCharms,
  [ProductType.TieClip]: TieClip,
  [ProductType.KeyChain]: KeyChain,
} as const;

export const ProductModelsByType: {
  [K in ProductType]: (typeof ProductModelsByTypeList)[K];
} = ProductModelsByTypeList;

export const ProductEntities = Object.values(ProductModelsByType).reduce(
  (acc, product) => {
    acc.push(product);
    if (product.attributesEntity) {
      acc.push(product.attributesEntity);
    }
    return acc;
  },
  [Product, ProductAttributes, FavoriteProduct] as any[],
);
