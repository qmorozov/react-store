import { toggleModal } from '../../layouts/toggleModal';

import '../view/style/product-card.client.scss';
import '../view/style/catalog.client.scss';

import { initRedirectSelect } from '../../app/client/helper.client';
import { ClientFavorites } from '../../saved/client/saved.service.client';
import { ClientCart } from '../../cart/client/cart.service.client';
import { LoadFor } from '../../app/client/render-client-page';

toggleModal('.catalog__filter-form', '.catalog__settings-filter');

ClientCart.listen();
ClientFavorites.listen();

LoadFor(document?.getElementById('filter-root'), (e) =>
  import('./ProductFiltersComponent').then((module) => module.ProductFiltersComponent(e)),
);
