import Banner from './Banner';
import OftenBuy from './OftenBuy';
import Brands from './Brands';
import CustomerProtection from './CustomerProtection';
import { AppInfo } from '../../app/models/app-info';
import { BannerSlide } from '../model/banner-slide';
import { Brand } from '../../product/models/brand.entity';
import { Category } from '../../product/models/category.entity';
import { BlogPost } from '../../blog/model/BlogPost';
import { Product } from '../../product/models/Product.abstract';
import React from 'react';
import Articles from './Articles';
import BlogCard from '../../layouts/shared/BlogCard';
import PopularProducts from '../../layouts/shared/PopularProducts';
import ProductCard from '../../catalog/view/ProductCard';

const MainPage = (
  appInfo: AppInfo,
  slides: BannerSlide[],
  brands: Brand[],
  categories: Category[],
  posts: BlogPost[],
  popularProducts: Product<any>[],
) => {
  const productCardsSlider = () => popularProducts.map((p) => <ProductCard product={p} />);

  const articlesSlider = () => posts.map((p) => <BlogCard blogCardData={p} />);

  return (
    <>
      <Banner slides={slides} />

      <OftenBuy categories={categories} />

      <PopularProducts productCards={productCardsSlider()} />

      {/*<PopularModels popularModels={popularModelsSlider()} />*/}

      <Brands brands={brands} />

      <CustomerProtection />

      <Articles articles={articlesSlider()} />
    </>
  );
};

export default MainPage;
