import { useTranslations } from 'src/translation/translation.context';

const ProductDelivery = () => {
  const tr = useTranslations();

  const deliveryData = [
    { label: tr.get('productCard.DeliveryTo'), value: '24 hours' },
    { label: tr.get('productCard.ExpectedDelivery'), value: 'Jun 2 - Jun 14' },
    { label: tr.get('productCard.ShippingCost'), value: '$99' },
  ];

  return (
    <div className="product-delivery">
      <span className="product__subtitle">{tr.get('productCard.Delivery')}</span>
      <dl className="list-info">
        {deliveryData.map(({ label, value }) => (
          <div key={label}>
            <dt>
              <span>{label}:</span>
            </dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
      <span className="product-delivery__policy">{tr.get('productCard.DeliveryPolicy')}</span>
    </div>
  );
};

export default ProductDelivery;
