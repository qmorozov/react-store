import Swiper from 'swiper/bundle';
import '../view/style/main.client.scss';

const bannerSlider = new Swiper('.banner', {
  speed: 1500,
  loop: true,
  autoplay: true,
  slidePrevClass: '--prev',
  slideNextClass: '--next',
  slideClass: 'banner__slide',
  slideActiveClass: '--active',
  wrapperClass: 'banner__slider',
  centeredSlides: true,
  pagination: {
    type: 'progressbar',
    el: '.banner__pagination',
    progressbarFillClass: '--progressbar-fill',
  },
  breakpoints: {
    300: {
      spaceBetween: 2,
      slidesPerView: 1.07,
    },
    1024: {
      spaceBetween: 2,
      slidesPerView: 1.05,
    },
    1280: {
      spaceBetween: 2,
      slidesPerView: 1.048,
    },
    1920: {
      spaceBetween: 2,
      slidesPerView: 1.045,
    },
  },
});

(() => {
  const sliders = document.querySelectorAll('.slider');

  sliders.forEach((slider: HTMLElement) => {
    const sliderItem = slider.querySelector<HTMLElement>('[class*="-slider-inner"], .slider-inner');

    const sliderDefault = {
      spaceBetween: 2,
      slidesPerView: 1.65,
      breakpoints: {
        350: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
        1280: { slidesPerView: 4 },
      },
    };

    const sliderBrands = {
      spaceBetween: 30,
      slidesPerView: 2.7,
      breakpoints: {
        1024: { slidesPerView: 4, spaceBetween: 30 },
        1280: { slidesPerView: 5, spaceBetween: 33 },
        1920: { slidesPerView: 6, spaceBetween: 36 },
      },
    };

    const sliderOftenBuy = {
      spaceBetween: 8,
      slidesPerView: 2.35,
      breakpoints: {
        1024: { slidesPerView: 6, spaceBetween: 16 },
        1280: { slidesPerView: 7, spaceBetween: 2 },
        1920: { spaceBetween: 2, slidesPerView: 8 },
      },
    };

    const sliderArticles = {
      spaceBetween: 2,
      slidesPerView: 1,
      breakpoints: {
        1024: { slidesPerView: 2 },
      },
    };

    const customProperties = () => {
      if (sliderItem.classList.contains('brands-slider-inner')) {
        return sliderBrands;
      } else if (sliderItem.classList.contains('often-buy-slider-inner')) {
        return sliderOftenBuy;
      } else if (sliderItem.classList.contains('articles-slider-inner')) {
        return sliderArticles;
      } else {
        return sliderDefault;
      }
    };

    new Swiper(sliderItem, {
      spaceBetween: customProperties().spaceBetween,
      slidesPerView: customProperties().slidesPerView,
      wrapperClass: 'slider__items',
      slideClass: 'slider__item',
      slidePrevClass: '--prev',
      slideNextClass: '--next',
      slideActiveClass: '--active',
      navigation: {
        disabledClass: '--disabled',
        nextEl: slider.querySelector<HTMLButtonElement>('.slider__button-next'),
        prevEl: slider.querySelector<HTMLButtonElement>('.slider__button-prev'),
      },
      pagination: {
        el: slider.querySelector<HTMLElement>('.slider__pagination'),
        type: 'progressbar',
        progressbarFillClass: '--progressbar-fill',
      },
      breakpoints: customProperties().breakpoints,
    });
  });
})();
