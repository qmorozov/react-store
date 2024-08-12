import { FC, useEffect, useState } from 'react';
import { OrderInfoDtoValidation } from '../../../dto/orderInfo.dtao.validation';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import { useTranslations } from '../../../../translation/translation.context';
import { OrderInfoApi } from '../../orderInfo.servie.client';
import { IOrderInfo } from '../../orderInfo.client';
import FormControl from '../../../../layouts/shared/FormControl';
import StarRating from '../StarRating/StarRating';
import { useNotification } from '../../../../admin/hooks/useNotification';

interface IReview {
  orderInfo: IOrderInfo;
  orderId: number;
}

enum OrderPlacedField {
  Comment = 'comment',
}

const Review: FC<IReview> = ({ orderInfo, orderId }) => {
  const tr = useTranslations();

  const [rating, setRating] = useState(orderInfo?.rating);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  const { showErrorNotification, showSuccessNotification } = useNotification();

  const { register, handleSubmit, errors, getValues } = useFormValidation(OrderInfoDtoValidation);

  const onSubmitHandler = ({ comment }: any) => {
    const reviewData = {
      comment,
      rating,
    };

    OrderInfoApi.addOrderReview(orderId, reviewData)
      .then(() => {
        setIsNotificationVisible(true);

        showSuccessNotification(
          tr.get(`orderIsPlaced.${orderInfo ? 'reviewWasEditedSuccessfully' : 'reviewWasAddedSuccessfully'}`),
          {
            onClose: () => setIsNotificationVisible(false),
          },
        );
      })
      .catch((error) => {
        showErrorNotification(error, null);
      });
  };

  return (
    <div className={`review ${isNotificationVisible ? '--sending-review' : ''}`}>
      <h2>{tr.get('orderIsPlaced.ExperienceQuestion')}</h2>

      <StarRating onChange={(ratingValue: number) => setRating(ratingValue)} defaultRating={orderInfo.rating} />

      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <FormControl placeholder={tr.get('orderIsPlaced.LeaveReview')} error={errors(OrderPlacedField.Comment)}>
          <textarea {...register(OrderPlacedField.Comment)} defaultValue={orderInfo.comment} />
        </FormControl>

        <div className="review__buttons">
          <button className="btn --primary">
            {tr.get(`orderIsPlaced.${orderInfo ? 'EditReviewButton' : 'LeaveReviewButton'}`)}
          </button>
          <a className="btn --light" href={tr.link('/cart/orders')}>
            {tr.get('orderIsPlaced.myOrders')}
          </a>
        </div>
      </form>
    </div>
  );
};

export default Review;
