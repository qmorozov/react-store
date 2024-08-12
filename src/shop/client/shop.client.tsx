import { useEffect, useState } from 'react';
import { TranslationContext } from '../../translation/translation.context';
import { RenderClientPage } from '../../app/client/render-client-page';
import { Translations } from '../../translation/translation.provider.client';
import { redirectToAuth } from '../../app/client/helper.client';
import { ShopApi } from './shop.api.client';
import { ManageProductApi } from '../../product/client/manageProduct/manageProduct.api.client';
import { useNotification } from '../../admin/hooks/useNotification';
import { ToastContainer } from 'react-toastify';
import { AccountServiceClient } from '../../user/client/account.service.client';
import { ProductOwner } from '../../product/models/Product.owner.enum';
import CurrentUser from '../../user/client/user.service.client';
import ProductListCard from '../../layouts/shared/ProductListCard';

import './shop/Style/shop.client.scss';
import 'react-toastify/dist/ReactToastify.css';

(async () => {
  const translation = await Translations.load('shop', 'common', 'error');

  redirectToAuth(CurrentUser);

  const productListData = await ShopApi.getProductList();

  return RenderClientPage(() => {
    const [productList, setProductList] = useState<any[]>(productListData);

    const urlParams = new URLSearchParams(window.location.search);
    const modifiedProductName = urlParams.get('modifiedProduct');

    const { showSuccessNotification } = useNotification();

    const handleDeleteProduct = (productId: number) => {
      ManageProductApi.deleteProduct(productId);
      const updatedProductList = productList.filter((product) => product.id !== productId);
      setProductList(updatedProductList);
    };

    useEffect(() => {
      if (modifiedProductName) {
        showSuccessNotification(`Product ${modifiedProductName} edited!`, { autoClose: 1800 });
      }
    }, [modifiedProductName]);

    const handleSwitchChange = async (enabled: boolean, productId: number) => {
      const status = enabled ? 1 : 0;

      const updatedProductList = productList.map((product) => {
        if (product.id === productId) {
          return { ...product, status: status };
        }
        return product;
      });
      setProductList(updatedProductList);
      await ManageProductApi.updateProductStatus(productId, status);
    };

    return (
      <TranslationContext.Provider value={translation}>
        <section className="shop-container --small">
          <h1 className="shop__title">{translation.get('shop.title')}</h1>
          <a className="btn --primary" href={'product/manage'}>
            {translation.get('shop.addAProduct')}
          </a>
          <ul className="shop__product-list">
            {productList.length ? (
              productList.map((product) => (
                <ProductListCard
                  switchVisible
                  parentTag="li"
                  key={product.id}
                  isProductVisible={product.status === 1}
                  defaultSwitchEnabled={product.status === 1}
                  switchLabel={translation.get('common.active')}
                  onSwitchChange={(enabled: boolean) => handleSwitchChange(enabled, product.id)}
                  headerButtons={
                    <button className="product-list-card__header-btn" onClick={() => handleDeleteProduct(product.id)}>
                      <i className="icon icon-garbage" />
                    </button>
                  }
                  product={product}
                  footerButtons={[
                    <a key="preview" className="btn --light" href={`product/${product.url}`}>
                      {translation.get('shop.preview')}
                    </a>,
                    <button
                      key="edit"
                      className="btn --dark"
                      onClick={() => (window.location.href = `/product/manage?id=${product.id}`)}
                    >
                      {translation.get('shop.edit')}
                    </button>,
                  ]}
                />
              ))
            ) : (
              <div className="no-info">
                <h2>{translation.get('shop.noInfo.title')}</h2>
                <p>{translation.get('shop.noInfo.subTitle')}</p>
              </div>
            )}
          </ul>
        </section>

        <ToastContainer />
      </TranslationContext.Provider>
    );
  });
})();

// {/*<button className="btn --dark">{translation.get('shop.markAsSold')}</button>*/}
// {/** === temp button === */}
