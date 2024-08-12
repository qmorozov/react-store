import Swiper from 'swiper/bundle';
import './Company/CompanyFeedback';
import '../view/style/company.client.scss';

const companyGallery = new Swiper('.company__gallery', {
  centeredSlides: true,
  speed: 1500,
  slidePrevClass: '--prev',
  slideNextClass: '--next',
  slideActiveClass: '--active',
  slideClass: 'company__gallery-item',
  wrapperClass: 'company__gallery-items',
  navigation: {
    disabledClass: '--disabled',
    nextEl: '.company__gallery-button__prev',
    prevEl: '.company__gallery-button__next',
  },
  spaceBetween: 50,
  slidesPerView: 'auto',
  breakpoints: {
    1024: {
      spaceBetween: 159,
    },
    1280: {
      spaceBetween: 200,
    },
    1920: {
      spaceBetween: 304,
    },
  },
});

const companyTeam = new Swiper('.company-team__inner', {
  slidePrevClass: '--prev',
  slideNextClass: '--next',
  slideActiveClass: '--active',
  slideClass: 'company-team__item',
  wrapperClass: 'company-team__items',
  navigation: {
    disabledClass: '--disabled',
    nextEl: '.company-team__button-next',
    prevEl: '.company-team__button-prev',
  },
  spaceBetween: 2,
  slidesPerView: 1,
  breakpoints: {
    310: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 4,
    },
  },
});

const companyInfo = new Swiper('.company-info__inner', {
  slidePrevClass: '--prev',
  slideNextClass: '--next',
  slideActiveClass: '--active',
  slideClass: 'company-info__item',
  wrapperClass: 'company-info__items',
  navigation: {
    disabledClass: '--disabled',
    nextEl: '.company-info__button-next',
    prevEl: '.company-info__button-prev',
  },
  slidesPerView: 1,
  spaceBetween: 40,
  breakpoints: {
    1024: {
      slidesPerView: 2,
      spaceBetween: 82,
    },
    1280: {
      slidesPerView: 2,
      spaceBetween: 102,
    },
    1920: {
      slidesPerView: 2,
      spaceBetween: 77,
    },
  },
});
