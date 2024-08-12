import { FC } from 'react';
import { OwnerInfo } from '../../../../product/models/OwnerInfo';
import { OwnerInfoPageType } from '../../../../catalog/models/OwnerInfoPageType.enum';
import { useTranslations } from '../../../../translation/translation.context';

interface ISellerReview {
  rating: number;
  user: OwnerInfo;
  comment: string;
  updatedAt: string;
}

const SellerReview: FC<ISellerReview> = ({ rating, user, comment, updatedAt }) => {
  const tr = useTranslations();
  const { image, name, link } = user;

  const formatDate = (dateString: string): string => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(dateString);
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  return (
    <div className="review">
      <div className="review__header">
        <div className="review__user">
          {image ? (
            <img className="review__user-photo" src={image} alt={name} />
          ) : (
            <span className="review__user-photo">{name.charAt(0)}</span>
          )}
          <a className="review__user-name" href={tr.link([link, OwnerInfoPageType.Catalog])} title={name}>
            {name}
          </a>
        </div>
        <div className="review__rating">
          <i className="icon icon-star" />
          <span>{rating}</span>
        </div>
        <span className="review__date">{formatDate(updatedAt)}</span>
      </div>
      <p className="review__content">{comment}</p>
    </div>
  );
};

export default SellerReview;
