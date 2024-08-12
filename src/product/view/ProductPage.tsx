import Breadcrumbs from 'src/layouts/shared/Breadcrumbs';
import ProductWriteUp from './ProductWriteUp';
import { Product } from '../models/Product.abstract';
import { AppInfo } from '../../app/models/app-info';
import { TranslationContext } from '../../translation/translation.context';
import { Category } from '../models/category.entity';
import ProductSpecifications from './ProductSpecifications';
import ProductCard from './ProductCard';
import { ProductCondition } from '../models/ProductCondition.enum';
import { QueryBuilder } from '../../app/services/query-builder';

const ProductPage = (
  appInfo: AppInfo,
  product: Product<any>,
  category: Category,
  productVariants: Record<string, any>,
) => {
  const categoryRoute = appInfo.translation.link(['/catalog', category.url]);
  const brandRoute = new QueryBuilder(categoryRoute, {}).filter({ brand: product.$brand.id });

  const breadcrumbs = [
    { title: category.name, route: categoryRoute },
    { title: product.$brand.name, route: brandRoute },
    { title: product.model },
  ];

  // const popularModelsSlider = () =>
  //   Array(13).fill(
  //     <ModelCard
  //       image="/images/popularModels.png"
  //       title="Swarovski vittore"
  //       desc="Stainless Steel & Whide Gold "
  //       type="178271, Men’s"
  //       price="17,469"
  //       currency="$"
  //     />,
  //   );
  //
  // const productCardsSlider = () => Array(9).fill(<Card product={product} sellerLink="/" />);

  return (
    <TranslationContext.Provider value={appInfo.translation}>
      <Breadcrumbs crumbs={breadcrumbs} />
      <section className="product">
        <ProductCard
          productVariants={productVariants}
          product={product}
          condition={appInfo.translation.get(
            `manageProduct.Fields.MainInfo.Condition.${ProductCondition[product.condition]}`,
          )}
        />
        <ProductSpecifications attributes={product.attributes} product={product} />
        <ProductWriteUp description={product.description} seller={product.$owner} />
        {/* <PopularProducts productCards={productCardsSlider()} />
        <PopularModels popularModels={popularModelsSlider()} /> */}
      </section>
    </TranslationContext.Provider>
  );
};

export default ProductPage;
