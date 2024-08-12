import { ProductType } from '../models/ProductType.enum';
import { iModelDto } from '../../app/validation/dto-validator';
import { ProductModelsByType } from '../models/ProductModelsByType';
import { BagDto } from '../models/bag/bag.dto';
import { WatchDto } from '../models/watch/watch.dto';
import { CoinDto } from '../models/coin/coin.dto';
import { RingDto } from '../models/ring/ring.dto';
import { NecklaceDto } from '../models/necklace/necklace.dto';
import { BraceletDto } from '../models/bracelet/bracelet.dto';
import { GlassesDto } from '../models/glasses/glasses.dto';
import { BeltDto } from '../models/belt/belt.dto';
import { WalletDto } from '../models/wallet/wallet.dto';
import { NaturalDiamondsDto } from '../models/natural-diamonds/natural-diamonds.dto';
import { LabGrownDiamondsDto } from '../models/lab-grown-diamonds/lab-grown-diamonds.dto';
import { EarringsDto } from '../models/earrings/earrings.dto';
import { JewellerySetsDto } from '../models/jewellery-sets/jewellery-sets.dto';
import { PendantsDto } from '../models/pendants/pendants.dto';
import { PinsBroochesDto } from '../models/PinsBrooches/pinsBrooches.dto';
import { PensDto } from '../models/pens/pens.dto';
import { CufflinksDto } from '../models/cufflinks/cufflinks.dto';
import { BagCharmsDto } from '../models/bag-charms/bag-charms.dto';
import { TieClipDto } from '../models/tie-clip/tie-clip.dto';
import { KeyChainDto } from '../models/key-chain/key-chain.dto';

type AllProductAttributesDto = {
  [key in ProductType]: abstract new () => iModelDto<
    InstanceType<(typeof ProductModelsByType)[key]['attributesEntity']>
  >;
};

type isProductAttributesDto<K extends keyof AllProductAttributesDto, T> = T extends AllProductAttributesDto[K]
  ? T
  : never;

const ProductAttributesDtoByProductTypeList = {
  [ProductType.Bag]: BagDto,
  [ProductType.Watch]: WatchDto,
  [ProductType.Coin]: CoinDto,
  [ProductType.Ring]: RingDto,
  [ProductType.Necklace]: NecklaceDto,
  [ProductType.Bracelet]: BraceletDto,
  [ProductType.Glasses]: GlassesDto,
  [ProductType.Belt]: BeltDto,
  [ProductType.Wallet]: WalletDto,
  [ProductType.NaturalDiamond]: NaturalDiamondsDto,
  [ProductType.LabGrownDiamond]: LabGrownDiamondsDto,
  [ProductType.Earrings]: EarringsDto,
  [ProductType.JewellerySets]: JewellerySetsDto,
  [ProductType.Pendants]: PendantsDto,
  [ProductType.PinsBrooches]: PinsBroochesDto,
  [ProductType.Pens]: PensDto,
  [ProductType.Cufflinks]: CufflinksDto,
  [ProductType.BagCharms]: BagCharmsDto,
  [ProductType.TieClip]: TieClipDto,
  [ProductType.KeyChain]: KeyChainDto,
} as const;

export const ProductAttributesDtoByProductType = ProductAttributesDtoByProductTypeList;
