import { ProductType } from '../models/ProductType.enum';
import { DtoValidator } from '../../app/validation/dto-validator';
import { ProductAttributesDtoByProductType } from './ProductAttributes.dto';
import { WatchDtoValidator } from '../models/watch/watch.dto.validation';
import { CoinDtoValidator } from '../models/coin/coin.dto.validation';
import { RingDtoValidator } from '../models/ring/ring.dto.validation';
import { NecklaceDtoValidator } from '../models/necklace/necklace.dto.validation';
import { BraceletDtoValidator } from '../models/bracelet/bracelet.dto.validation';
import { GlassesDtoValidator } from '../models/glasses/glasses.dto.validation';
import { BeltDtoValidator } from '../models/belt/belt.dto.validation';
import { BagDtoValidator } from '../models/bag/bag.dto.validation';
import { WalletDtoValidator } from '../models/wallet/wallet.dto.validation';
import { NaturalDiamondsDtoValidator } from '../models/natural-diamonds/natural-diamonds.dto.validation';
import { LabGrownDiamondsDtoValidator } from '../models/lab-grown-diamonds/lab-grown-diamonds.dto.validation';
import { EarringsDtoValidator } from '../models/earrings/earrings.dto.validation';
import { JewellerySetsDtoValidator } from '../models/jewellery-sets/jewellery-sets.dto.validation';
import { PendantsDtoValidator } from '../models/pendants/pendants.dto.validation';
import { PinsBroochesDtoValidator } from '../models/PinsBrooches/pinsBrooches.dto.validation';
import { CufflinksDtoValidator } from '../models/cufflinks/cufflinks.dto.validation';
import { BagCharmsDtoValidator } from '../models/bag-charms/bag-charms.dto.validation';
import { PensDtoValidator } from '../models/pens/pens.dto.validation';
import { TieClipDtoValidator } from '../models/tie-clip/tie-clip.dto.validation';
import { KeyChainDtoValidator } from '../models/key-chain/key-chain.dto.validation';

export const ProductAttributesDtoValidations: {
  [key in ProductType]: DtoValidator<InstanceType<(typeof ProductAttributesDtoByProductType)[key]>>;
} = {
  [ProductType.Watch]: WatchDtoValidator,
  [ProductType.Coin]: CoinDtoValidator,
  [ProductType.Ring]: RingDtoValidator,
  [ProductType.Necklace]: NecklaceDtoValidator,
  [ProductType.Bracelet]: BraceletDtoValidator,
  [ProductType.Glasses]: GlassesDtoValidator,
  [ProductType.Belt]: BeltDtoValidator,
  [ProductType.Bag]: BagDtoValidator,
  [ProductType.Wallet]: WalletDtoValidator,
  [ProductType.NaturalDiamond]: NaturalDiamondsDtoValidator,
  [ProductType.LabGrownDiamond]: LabGrownDiamondsDtoValidator,
  [ProductType.Earrings]: EarringsDtoValidator,
  [ProductType.JewellerySets]: JewellerySetsDtoValidator,
  [ProductType.Pendants]: PendantsDtoValidator,
  [ProductType.PinsBrooches]: PinsBroochesDtoValidator,
  [ProductType.Pens]: PensDtoValidator,
  [ProductType.Cufflinks]: CufflinksDtoValidator,
  [ProductType.BagCharms]: BagCharmsDtoValidator,
  [ProductType.TieClip]: TieClipDtoValidator,
  [ProductType.KeyChain]: KeyChainDtoValidator,
};
