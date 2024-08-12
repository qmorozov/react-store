import { useState } from 'react';
import { ReviewsApi } from './reviews.api.client';
import { RenderClientPage } from '../../../app/client/render-client-page';
import { Translations } from '../../../translation/translation.provider.client';
import { TranslationContext } from '../../../translation/translation.context';
import SellerReview from './components/SellerReview';

export async function SellerReviewList(sellerReviewId: string | HTMLElement = 'seller-review') {
  const root = typeof sellerReviewId === 'string' ? document.getElementById(sellerReviewId) : sellerReviewId;

  if (!root) {
    return;
  }

  const translation = await Translations.load('reviews', 'common', 'error');

  const sellerType = root?.dataset?.sellerType;
  const sellerUuid = root?.dataset?.sellerUuid;

  const reviewsInfo = await ReviewsApi.getReviews(sellerType, sellerUuid);

  return RenderClientPage(() => {
    const [reviewsData, setReviewsData] = useState(reviewsInfo.slice(0, 3));
    const [numReviewsShown, setNumReviewsShown] = useState(3);

    const handleMoreClick = () => {
      const newNumReviewsShown = numReviewsShown + 3;
      setReviewsData(reviewsInfo.slice(0, newNumReviewsShown));
      setNumReviewsShown(newNumReviewsShown);
    };

    return (
      <TranslationContext.Provider value={translation}>
        <div className="seller-reviews">
          <span className="seller-reviews__title">
            {reviewsData.length} {translation.get('reviews.title')}
          </span>
          <div className="seller-reviews__items">
            {reviewsData.map(({ id, rating, comment, updatedAt, user }) => (
              <SellerReview key={id} rating={rating} comment={comment} user={user} updatedAt={updatedAt} />
            ))}
          </div>
          {numReviewsShown < reviewsInfo.length && (
            <div className="seller-reviews__btn">
              <button className="show-more-btn" onClick={handleMoreClick}>
                {reviewsInfo.length - numReviewsShown} {translation.get('common.More')}
              </button>
            </div>
          )}
        </div>
      </TranslationContext.Provider>
    );
  }, root);
}
