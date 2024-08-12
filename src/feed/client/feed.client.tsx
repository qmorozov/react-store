import { useCallback, useState } from 'react';
import { FeedApi } from './feed.api.client';
import { RenderClientPage } from '../../app/client/render-client-page';
import { Translations } from '../../translation/translation.provider.client';
import { getCurrencySymbol } from '../../payment/model/currency.info';
import { redirectToAuth } from '../../app/client/helper.client';
import { SuggestPriceStatus } from '../../cart/model/SuggestPriceStatus.enum';
import CurrentUser from '../../user/client/user.service.client';
import ProductListCard from '../../layouts/shared/ProductListCard';
import { TranslationContext } from '../../translation/translation.context';

import './style/feed.client.scss';

(async () => {
  const translation = await Translations.load('feed', 'common', 'error');

  redirectToAuth(CurrentUser);

  const feedFullInfo = await FeedApi.getFullFeed();

  return RenderClientPage(() => {
    const [feedData, setFeedData] = useState(feedFullInfo);

    const formatTime = (hours: number): string => {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;

      if (days === 3) {
        return `${days}${translation.get('feed.days')}`;
      } else {
        return `${days}${translation.get('feed.days')} ${remainingHours}${translation.get('feed.hours')}`;
      }
    };

    const removeFeedItem = useCallback(
      async (id: number) => {
        await FeedApi.removeFeed(id);

        const updatedFeed = await FeedApi.getFullFeed();

        setFeedData(updatedFeed);
      },
      [feedData],
    );

    const denyFeedItem = async (id: number) => {
      await FeedApi.setFeedStatus(id, 'decline');
      const updatedFeed = await FeedApi.getFullFeed();
      setFeedData(updatedFeed);
    };

    const acceptFeedItem = async (id: number) => {
      await FeedApi.setFeedStatus(id, 'accept');
      const updatedFeed = await FeedApi.getFullFeed();
      setFeedData(updatedFeed);
    };

    return (
      <TranslationContext.Provider value={translation}>
        <section className="feed-container --small">
          <h1 className="feed__title">{translation.get('feed.title')}</h1>
          {feedData.length ? (
            <div className="feed__items">
              {feedData.map(({ id, expiredInHours, status, product, suggestedPrice, suggestedPriceCurrency, user }) => {
                const isStatusPending = status === SuggestPriceStatus.Pending;

                return (
                  <div className={`feed__item ${!isStatusPending ? '--disabled' : ''}`} key={id}>
                    <div className="feed__item-header">
                      <p className="feed__item-header__info" title={`${user.firstName} ${user.lastName}`}>
                        <a>
                          {user.firstName} {user.lastName}
                        </a>{' '}
                        <span>
                          {translation.get('feed.suggestsAPriceOf')} {suggestedPrice}
                          <i className="feed__currency"> {getCurrencySymbol(suggestedPriceCurrency)}</i>
                        </span>
                      </p>
                      {expiredInHours && (
                        <p className="feed__item-header__time">
                          {translation.get('feed.doYouWantToAcceptThisPriceJustForHimFor')} {formatTime(expiredInHours)}
                          ?
                        </p>
                      )}
                    </div>
                    <ProductListCard
                      like={false}
                      product={product}
                      headerButtons={
                        <button className="product-list-card__header-btn" onClick={() => removeFeedItem(id)}>
                          <i className="icon icon-garbage" />
                        </button>
                      }
                      footerButtons={[
                        <button
                          key="deny"
                          className="btn --light"
                          disabled={!isStatusPending}
                          onClick={() => denyFeedItem(id)}
                        >
                          {translation.get('feed.deny')}
                        </button>,
                        <button
                          key="accept"
                          className="btn --primary"
                          disabled={!isStatusPending}
                          onClick={() => acceptFeedItem(id)}
                        >
                          {translation.get('feed.acceptThePrice')}
                        </button>,
                      ]}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="no-info">
              <h2>{translation.get('feed.noInfo.title')}</h2>
              <p>{translation.get('feed.noInfo.subTitle')}</p>
            </div>
          )}
        </section>
      </TranslationContext.Provider>
    );
  });
})();
