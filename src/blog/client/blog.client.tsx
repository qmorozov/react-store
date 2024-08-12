import Swiper from 'swiper/bundle';
import '../view/style/blog.client.scss';

const blogOneGallery = new Swiper('.blog-one-gallery', {
  spaceBetween: 40,
  centeredSlides: true,
  slidePrevClass: '--prev',
  slideNextClass: '--next',
  slideActiveClass: '--active',
  slideClass: 'blog-one-gallery__item',
  wrapperClass: 'blog-one-gallery__items',
  navigation: {
    disabledClass: '--disabled',
    nextEl: '.blog-one-gallery__button-next',
    prevEl: '.blog-one-gallery__button-prev',
  },
  initialSlide: 1,
  slidesPerView: 'auto',
  breakpoints: {
    1024: {
      spaceBetween: 163,
    },
    1280: {
      spaceBetween: 203,
    },
    1920: {
      spaceBetween: 306,
    },
  },
});
