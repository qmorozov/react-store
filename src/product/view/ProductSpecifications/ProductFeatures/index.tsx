import { useTranslations } from 'src/translation/translation.context';
import { ProductSex } from 'src/product/models/Product.sex.enum';
import { ProductAttributeView } from '../../../models/ProductAttribute.view';

const ProductFeatures = ({ attributes, product }) => {
  const tr = useTranslations();

  const showAttributes = Object.values(attributes || {}).filter((item) => item instanceof ProductAttributeView);

  return (
    <div className="product-features">
      <span className="product__subtitle">{tr.get('productCard.Features')}</span>
      <span className="product-features__heading">{tr.get('productCard.BasicInfo')}</span>
      <dl className="list-info">
        <div>
          <dt>
            <span>{tr.get(`filter.brand`)}:</span>
          </dt>
          <dd>{product.$brand.name}</dd>
        </div>
        <div>
          <dt>
            <span>{tr.get(`filter.year`)}:</span>
          </dt>
          <dd>{product.year}</dd>
        </div>
        <div>
          <dt>
            <span>{tr.get(`filter.serialNumber`)}:</span>
          </dt>
          <dd>{product.serialNumber}</dd>
        </div>
        <div>
          <dt>
            <span>{tr.get(`filter.sex`)}:</span>
          </dt>
          <dd>{tr.get(`sexType.${ProductSex[product.sex]}`)}</dd>
        </div>
        {showAttributes.map(({ title, name }) => (
          <div key={title}>
            <dt>
              <span>{tr.get(title)}:</span>
            </dt>
            <dd>{name}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default ProductFeatures;
