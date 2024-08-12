import { FC, useState } from 'react';

interface IStarRating {
  count?: number;
  classes?: string;
  defaultRating?: number;
  onChange?: (rating: number) => void;
}

const StarRating: FC<IStarRating> = ({ defaultRating = 0, classes, onChange, count = 5 }) => {
  const [hoverValue, setHoverValue] = useState<number>(0);
  const [ratingValue, setRatingValue] = useState<number>(defaultRating);

  const handleClick = (starIndex: number): void => {
    setRatingValue(starIndex);
    if (onChange) {
      onChange(starIndex);
    }
  };

  const handleHover = (starIndex: number): void => {
    setHoverValue(starIndex);
  };

  const handleLeave = (): void => {
    setHoverValue(ratingValue);
  };

  const handleDoubleClick = (): void => {
    setRatingValue(0);
    setHoverValue(0);
    if (onChange) {
      onChange(0);
    }
  };

  return (
    <div className={`star-rating ${classes ?? ''}`}>
      {[...Array(count)].map((_, index: number) => {
        const starIndex = index + 1;

        return (
          <button
            type="button"
            key={starIndex}
            onMouseLeave={handleLeave}
            onDoubleClick={handleDoubleClick}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleHover(starIndex)}
            className={starIndex <= (hoverValue || ratingValue) ? '--on' : ''}
          >
            <svg viewBox="0 0 46 44">
              <path d="M23 1.62899L27.8847 16.7752L27.9968 17.1226L28.3617 17.1218L44.2761 17.087L31.3806 26.4131L31.0849 26.6269L31.1984 26.9738L36.1493 42.0985L23.2948 32.7161L23 32.501L22.7052 32.7161L9.85065 42.0985L14.8016 26.9738L14.9151 26.6269L14.6194 26.4131L1.72391 17.087L17.6383 17.1218L18.0032 17.1226L18.1153 16.7752L23 1.62899Z" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
