import { FC, ReactNode } from 'react';
import { useTranslations } from '../../../translation/translation.context';

interface ISlider {
  slides: ReactNode[];
  progressBar?: boolean;
  navigationButtons?: boolean;
  onClickAll?: string;
  allButton?: boolean;
  containerClass?: string;
}

const Slider: FC<ISlider> = ({ slides, navigationButtons, progressBar, onClickAll, allButton, containerClass }) => {
  const tr = useTranslations();

  return (
    <div className="slider">
      <div className={containerClass ? `${containerClass}-slider-inner` : 'slider-inner'}>
        <div className="slider__items" style={{ paddingBottom: progressBar ? '' : 0 }}>
          {slides.map((slide, index) => (
            <div key={index} className="slider__item">
              {slide}
            </div>
          ))}
        </div>
        {progressBar ? <span className="slider__pagination"></span> : null}
      </div>
      {navigationButtons ? (
        <>
          <button className="slider__button-next" title="Next">
            <i className="icon icon-arrow" />
          </button>
          <button className="slider__button-prev" title="Prev">
            <i className="icon icon-arrow" />
          </button>
        </>
      ) : null}
      {allButton ? (
        <a title={tr.get('common.ShowAll')} href={onClickAll} className="slider__all-button">
          {tr.get('common.All')}
        </a>
      ) : null}
    </div>
  );
};

export default Slider;
