import { FC, useState } from 'react';
import { useTranslations } from '../../translation/translation.context';
import SellerReview from '../../layouts/shared/SellerReview/components/SellerReview';

interface IReviewsTab {
  reviews: any[];
  mine?: boolean;
}

const ReviewsTab: FC<IReviewsTab> = ({ reviews, mine = false }) => {
  const tr = useTranslations();

  const [visibleOrders, setVisibleOrders] = useState<number>(4);

  const showMore = () => {
    setVisibleOrders((prevVisibleOrders: number) => prevVisibleOrders + 4);
  };

  const remainingOrders = reviews.length - visibleOrders;
  const showMoreText = remainingOrders > 0 ? `${tr.get('common.More')} ${remainingOrders}` : tr.get('common.NoMore');

  return (
    <div className="reviews-items">
      {reviews.length ? (
        reviews
          .slice(0, visibleOrders)
          .map(({ id, rating, user, comment, updatedAt }) => (
            <SellerReview key={id} rating={rating} user={user} comment={comment} updatedAt={updatedAt} />
          ))
      ) : (
        <div className="no-info">
          <h2>{tr.get(`reviews.noReviews${mine ? 'Mine' : 'ForMe'}.title`)}</h2>
          <p>{tr.get(`reviews.noReviews${mine ? 'Mine' : 'ForMe'}.subTitle`)}</p>
        </div>
      )}
      {remainingOrders > 0 && (
        <button className="show-more-btn" onClick={showMore}>
          {showMoreText}
        </button>
      )}
    </div>
  );
};

export default ReviewsTab;
