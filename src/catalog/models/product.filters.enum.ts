import { ProductType } from '../../product/models/ProductType.enum';
import { ProductFilter } from './filter/product.filter';
import { WatchFilter } from './filter/watch.filter';
import { RingFilter } from './filter/ring.filter';
import { NecklaceFilter } from './filter/necklace.filter';
import { BraceletFilter } from './filter/bracelet.filter';
import { GlassesFilter } from './filter/glasses.filter';
import { BeltFilter } from './filter/belt.filter';
import { BagFilter } from './filter/bag.filter';
import { WalletFilter } from './filter/wallet.filter';
import { CoinFilter } from './filter/coin.filter';
import { NaturalDiamondFilter } from './filter/natural-diamond.filter';
import { LabGrownDiamondFilter } from './filter/lab-grown-diamond.filter';
import { JewellerySetsFilter } from './filter/jewellery-sets.filter';
import { PendantsFilter } from './filter/pendants.filter';
import { EarringsFilter } from './filter/earrings.filter';
import { PinsBroochesFilter } from './filter/pins-brooches.filter';
import { PensFilter } from './filter/pens.filter';
import { CufflinksFilter } from './filter/cufflinks.filter';
import { BagCharmsFilter } from './filter/bag-charms.filter';
import { TieClipFilter } from './filter/tie-clip.filter';
import { KeyChainFilter } from './filter/key-chain.filter';

export const filterByProductType: Record<ProductType, typeof ProductFilter> = {
  [ProductType.Watch]: WatchFilter,
  [ProductType.Coin]: CoinFilter,
  [ProductType.Ring]: RingFilter,
  [ProductType.Necklace]: NecklaceFilter,
  [ProductType.Bracelet]: BraceletFilter,
  [ProductType.Glasses]: GlassesFilter,
  [ProductType.Belt]: BeltFilter,
  [ProductType.Bag]: BagFilter,
  [ProductType.Wallet]: WalletFilter,
  [ProductType.NaturalDiamond]: NaturalDiamondFilter,
  [ProductType.LabGrownDiamond]: LabGrownDiamondFilter,
  [ProductType.Earrings]: EarringsFilter,
  [ProductType.JewellerySets]: JewellerySetsFilter,
  [ProductType.Pendants]: PendantsFilter,
  [ProductType.PinsBrooches]: PinsBroochesFilter,
  [ProductType.Pens]: PensFilter,
  [ProductType.Cufflinks]: CufflinksFilter,
  [ProductType.BagCharms]: BagCharmsFilter,
  [ProductType.TieClip]: TieClipFilter,
  [ProductType.KeyChain]: KeyChainFilter,
} as const;

export function getFilterByProductType(
  productType: ProductType | undefined,
  ...args: ConstructorParameters<typeof ProductFilter>
) {
  const filter = productType ? filterByProductType[productType] : ProductFilter;
  return filter ? new filter(...args) : null;
}
