import Swiper from 'swiper/bundle';
import Drift from 'drift-zoom';

import { ClientCart } from '../../cart/client/cart.service.client';
import { ClientFavorites } from '../../saved/client/saved.service.client';
import '../../layouts/shared/SellerReview/seller-review';
import './suggestPrice/index';
import '../../layouts/shared/SuggestPrice';

import '../view/style/product.client.scss';
import { LoadFor } from '../../app/client/render-client-page';

ClientCart.listen();
ClientFavorites.listen();

const galleryThumbs = new Swiper('.gallery__thumbs', {
  spaceBetween: 16,
  slidesPerView: 'auto',
  wrapperClass: 'gallery__wrapper',
  slideClass: 'gallery__item',
  slidePrevClass: '--prev',
  slideNextClass: '--next',
  slideActiveClass: '--active',
  freeMode: true,
  watchSlidesVisibility: true,
  watchSlidesProgress: true,
  loop: false,
  breakpoints: {
    1024: {
      spaceBetween: 8,
    },
    1280: {
      spaceBetween: 16,
    },
    1920: {
      spaceBetween: 26,
    },
  },
});

const galleryTop = new Swiper('.gallery__top', {
  wrapperClass: 'gallery__wrapper',
  slideClass: 'gallery__item',
  slidePrevClass: '--prev',
  slideNextClass: '--next',
  speed: 500,
  navigation: {
    disabledClass: '--disabled',
    nextEl: '.slider__button-next',
    prevEl: '.slider__button-prev',
  },
  thumbs: {
    swiper: galleryThumbs,
  },
});

// const galleryFullScreen = new Swiper('.gallery__full-screen', {
//   wrapperClass: 'gallery__wrapper',
//   slideClass: 'gallery__item',
//   slidePrevClass: '--prev',
//   slideNextClass: '--next',
//   speed: 500,
//   navigation: {
//     disabledClass: '--disabled',
//     nextEl: '.slider__button-next',
//     prevEl: '.slider__button-prev',
//   },
//   thumbs: {
//     swiper: galleryThumbs,
//   },
// });

(async (sliderElementId) => {
  const sliderElement = document.getElementById(sliderElementId) as HTMLDivElement;
  const body = document.getElementsByTagName('body')[0];
  const buttonNext = sliderElement.getElementsByClassName('slider__button-next')[0].getElementsByClassName('icon')[0];
  const buttonPrev = sliderElement.getElementsByClassName('slider__button-prev')[0].getElementsByClassName('icon')[0];

  if (sliderElement) {
    sliderElement.addEventListener('click', (event) => {
      if ((event.target as HTMLElement)?.classList?.contains('open-full-screen')) {
        sliderElement?.querySelectorAll('.slider-main-image')?.forEach((image: HTMLImageElement) => {
          image.src = image.dataset?.srcLarge || image.src;
        });

        sliderElement?.classList.add('gallery__full-screen');
        buttonNext?.classList.add('icon-big-arrow', 'next');
        buttonPrev?.classList.add('icon-big-arrow', 'prev');
        body?.classList.add('overflow');
      }
    });

    sliderElement?.querySelector('#closeButton')?.addEventListener('click', (event) => {
      sliderElement?.classList.remove('gallery__full-screen');
      buttonNext?.classList.remove('icon-big-arrow');
      buttonPrev?.classList.remove('icon-big-arrow');
      body?.classList.remove('overflow');
      sliderElement?.querySelectorAll('.slider-main-image')?.forEach((image: HTMLImageElement) => {
        image.src = image.dataset?.srcMedium || image.src;
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const galleryElement = document.querySelector('.product__gallery');
        galleryElement?.classList.remove('gallery__full-screen');
      }
    });
  }
})('product-images-slider');

LoadFor(document?.getElementById('seller-review'), (e) =>
  import('../../layouts/shared/SellerReview/seller-review').then((module) => module.SellerReviewList(e)),
);

const galleryImages = document.querySelectorAll('.slider-main-image') as NodeListOf<HTMLImageElement>;

const responsiveImageZoom = (images: NodeListOf<HTMLImageElement>): void => {
  images.forEach((image: HTMLImageElement) => {
    if (window.innerWidth >= 1024) {
      new Drift(image, {
        paneContainer: document.querySelector('.product__gallery-zoom') as Element,
      });
    }
  });
};

responsiveImageZoom(galleryImages);
