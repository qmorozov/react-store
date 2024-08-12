import ProductFeatures from './ProductFeatures';
import ProductDelivery from './ProductDelivery';
import ProductSeller from './ProductSeller';

const ProductSpecifications = ({ attributes, product }) => {
  return (
    <div className="product-specifications-container --small">
      <ProductFeatures attributes={attributes} product={product} />
      <ProductDelivery />
      <ProductSeller seller={product.$owner} />
    </div>
  );
};

export default ProductSpecifications;
