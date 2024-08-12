import ProductTab from '../CatalogTabs/ProductTab';

const CatalogFilterForm = () => {
  return (
    <>
      <button className="catalog__close-filter --close-button">
        <span></span>
      </button>
      <ProductTab />
      {/*<Tabs options={tabOptions} selectedTabId={'product'} />*/}
    </>
  );
};

export default CatalogFilterForm;

// const tabOptions: Tab[] = [
//   {
//     id: 'product',
//     title: tr.get('common.ProductTab'),
//     content: <ProductTab />,
//   },
//   {
//     id: 'seller',
//     title: tr.get('common.SellerTab'),
//     content: <SellerTab />,
//   },
// ];
