import { RenderClientPage } from '../../app/client/render-client-page';
import { Translations } from '../../translation/translation.provider.client';
import { redirectToAuth } from '../../app/client/helper.client';
import { ReviewsApi } from './reviews.api.client';
import { TranslationContext } from '../../translation/translation.context';
import { AccountServiceClient } from '../../user/client/account.service.client';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import CurrentUser from '../../user/client/user.service.client';
import Tabs, { Tab } from '../../layouts/shared/Tabs';
import ReviewsTab from './reviewsTab';

import './style/reviews.client.scss';

enum ReviewTabs {
  ForMe = 'forMe',
  Mine = 'mine',
}

(async () => {
  const translation = await Translations.load('reviews', 'common', 'error');

  redirectToAuth(CurrentUser);

  const reviewsForMe = await ReviewsApi.getReviewsForMe();
  const reviewsMine = await ReviewsApi.getReviewsMine();

  return RenderClientPage(() => {
    const reviewsTabs: Tab[] = [
      {
        id: ReviewTabs.ForMe,
        title: translation.get(`reviews.${ReviewTabs.ForMe}`),
        content: <ReviewsTab reviews={reviewsForMe} />,
      },
      {
        id: ReviewTabs.Mine,
        title: translation.get(`reviews.${ReviewTabs.Mine}`),
        content: <ReviewsTab reviews={reviewsMine} mine={true} />,
      },
    ];

    return (
      <TranslationContext.Provider value={translation}>
        <section className="reviews-container --small">
          <h1 className="reviews__title">{translation.get('reviews.title')}</h1>
          <Tabs options={reviewsTabs} selectedTabId={reviewsTabs[0].id} />
        </section>
      </TranslationContext.Provider>
    );
  });
})();
