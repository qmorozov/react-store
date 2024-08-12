import { useEffect, useRef, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { RenderClientPage } from '../../app/client/render-client-page';
import { TranslationContext } from '../../translation/translation.context';
import { Translations } from '../../translation/translation.provider.client';
import {
  Basic,
  EditSubProduct,
  FilterAttributes,
  Product,
  SuggestSendingProduct,
} from './manageProduct/manageProductContext';
import { ManageProductApi } from './manageProduct/manageProduct.api.client';
import { redirectToAuth } from '../../app/client/helper.client';
import { Currency } from '../../payment/model/currency.enum';
import { CatalogApi } from '../../catalog/client/catalog.api.client';
import { PricingApi } from '../../pricing/client/pricing.api.client';
import { ProductCondition } from '../models/ProductCondition.enum';
import { Tab } from '../../layouts/shared/Tabs';
import CurrentUser from '../../user/client/user.service.client';
import ManageProductSelector, { ICategory } from './manageProduct/manageProductSelector';
import ManageProductTabs, { TabsEnum } from './manageProduct/manageProductTabs';
import SubProductForm from './manageProduct/Tabs/Summary/SubProductForm';

import '../view/style/manageProduct.client.scss';
import { ProductOwner } from '../models/Product.owner.enum';
import { AccountServiceClient } from '../../user/client/account.service.client';
import { useNotification } from '../../admin/hooks/useNotification';

export interface IProductAttribute {
  [key: string]: string | number | boolean;
}

export interface ProductImage {
  id: string;
  large: string;
  medium: string;
  small: string;
}

export interface IProductData {
  productType: string;
  product: {
    id: number;
    sex: number;
    url: string;
    year: number;
    model: string;
    title: string;
    price: number;
    cover: string;
    rating: number;
    brandId: number;
    currency: Currency;
    description: string;
    serialNumber: string;
    suggestPrice?: number;
    images: ProductImage[];
    canSuggestPrice: boolean;
    customFeatures?: string | null;
    condition: ProductCondition;
    referenceNumber: string;
  };
  attributes: IProductAttribute;
}

interface IArrayForSelect {
  id: number;
  name: string;
  uuid?: string;
  value?: string;
  image?: string;
  isPopular?: boolean;
}

export const arrayForSelect = (array: IArrayForSelect[]): { id: number | string; value: string; label: string }[] => {
  return (
    array?.map(({ id, uuid, name, value }: IArrayForSelect) => {
      return {
        id: id ? id : uuid,
        value: value || name,
        label: name || value,
      };
    }) || []
  );
};

export const isFieldSuggested = (fieldName: string, productData: IProductData, isSuggestProduct: boolean): boolean => {
  const fieldValue = productData.product[fieldName] || productData.attributes[fieldName];
  const isFieldSuggested = fieldValue !== undefined && fieldValue !== null && String(fieldValue).trim() !== '';
  return isSuggestProduct && isFieldSuggested;
};

(async () => {
  const translation = await Translations.load('manageProduct', 'common', 'error');

  const categories: ICategory[] = await ManageProductApi.getCategories();

  redirectToAuth(CurrentUser);

  let productId: number | string = new URLSearchParams(window.location.search).get('id') || null;

  const accountUuid =
    ProductOwner.Shop === AccountServiceClient.get().type ? AccountServiceClient.get().uuid : undefined;

  let currentPlan = null;

  currentPlan = await PricingApi.getCurrentPlan(accountUuid).catch(() => {
    if (!productId) {
      window.location.href = translation.link('/pricing/');
    }
  });

  return RenderClientPage(() => {
    const shouldLog = useRef(true);

    const [step, setStep] = useState<Tab['id']>();

    const [editSubProduct, setEditSubProduct] = useState<IProductData | null>();

    const [currentPlanData, setCurrentPlanData] = useState<any>(currentPlan);

    const [subProductForm, setSubProductForm] = useState<boolean>(false);
    const [showCustomFeatures, setShowCustomFeatures] = useState<boolean>(false);
    const [showTabs, setShowTabs] = useState<boolean>(!!productId || false);
    const [attributes, setAttributes] = useState<IProductAttribute[]>([]);
    const [isSendingData, setIsSendingData] = useState<boolean>(false);
    const [isSuggestProduct, setIsSuggestProduct] = useState<boolean>(false);
    const [productData, setProductData] = useState<IProductData>({
      productType: '',
      product: {
        id: null,
        url: '',
        year: 0,
        title: '',
        price: 0,
        images: [],
        model: '',
        cover: '',
        rating: 0,
        brandId: null,
        description: '',
        serialNumber: '',
        suggestPrice: 0,
        sex: null,
        customFeatures: null,
        currency: Currency.USD,
        canSuggestPrice: false,
        condition: null,
        referenceNumber: '',
      },
      attributes: {},
    });

    const { showErrorNotification, showSuccessNotification } = useNotification();

    useEffect(() => {
      if (productData.product.id) {
        productId = productData.product.id;

        setVisibleTabs({
          [TabsEnum.general]: false,
          [TabsEnum.details]: false,
          [TabsEnum.photos]: false,
          [TabsEnum.summary]: false,
        });
      }
    }, [productData.product.id]);

    const [visibleTabs, setVisibleTabs] = useState({
      [TabsEnum.general]: false,
      [TabsEnum.details]: true,
      [TabsEnum.photos]: true,
      [TabsEnum.summary]: true,
    });

    useEffect(() => {
      if (!productId) {
        return;
      }

      const fetchProductData = async () => {
        try {
          const productResponse = await ManageProductApi.getProduct(productId);
          const { type, ...productWithoutType } = productResponse.product;

          await setProductData({
            productType: productResponse.product.type,
            product: {
              ...productData.product,
              ...productWithoutType,
            },
            attributes: productResponse.attributes,
          });
        } catch (error) {
          window.location.href = translation.link('/product/manage');
        }
      };

      if (shouldLog.current) {
        shouldLog.current = false;

        fetchProductData();
      }
    }, [productId]);

    const getFilters = async (productType) => {
      try {
        const filterInfo = await CatalogApi.getFilterInfo(productType);
        setAttributes(filterInfo);
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      if (productData.productType) {
        getFilters(productData.productType);
      }
    }, [productData.productType]);

    const manageProduct = async (onSuccess) => {
      if (!productId) {
        setIsSendingData(true);

        try {
          const addedProductData = await ManageProductApi.addProduct(
            productData.productType,
            {
              product: productData.product,
              attributes: productData.attributes,
            },
            accountUuid,
          );

          await setProductData((prevData: IProductData) => ({
            ...prevData,
            product: addedProductData.product,
            attributes: addedProductData.attributes,
          }));

          setIsSendingData(false);

          if (onSuccess) {
            onSuccess();
          }
        } catch ({ response }) {
          showErrorNotification(response.data.error.message, {
            onClose: () => {
              window.location.href = translation.link('/pricing/');
              setIsSendingData(false);
            },
          });
        }
      } else {
        try {
          const updatedProductData = await ManageProductApi.updateProduct(productId, {
            product: productData.product,
            attributes: productData.attributes,
          });

          setProductData((prevData: IProductData) => ({
            ...prevData,
            product: updatedProductData.product,
            attributes: updatedProductData.attributes,
          }));

          if (onSuccess) {
            onSuccess();
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    const setDetails = async (details: IProductData['attributes']) => {
      if (Object.keys(details).length > 0) {
        await setProductData((prevData: IProductData) => ({
          ...prevData,
          attributes: details,
        }));
      }
    };

    return (
      <TranslationContext.Provider value={translation}>
        <FilterAttributes.Provider value={[attributes]}>
          <SuggestSendingProduct.Provider
            value={{ setIsSendingData, setIsSuggestProduct, isSuggestProduct, isSendingData }}
          >
            <Product.Provider value={{ productData, setProductData }}>
              <EditSubProduct.Provider value={{ setEditSubProduct, editSubProduct }}>
                <Basic.Provider
                  value={{
                    step,
                    setStep,
                    productId,
                    visibleTabs,
                    setVisibleTabs,
                    currentPlanData,
                    showCustomFeatures,
                    setShowCustomFeatures,
                  }}
                >
                  {subProductForm ? (
                    <SubProductForm setSubProductForm={setSubProductForm} />
                  ) : (
                    <section className={`manage-product-container --small ${isSendingData ? '--sending-data' : ''}`}>
                      <h1 className="manage-product__title">
                        {translation.get(
                          `manageProduct.${productId ? 'edit' : 'add'}${
                            productData.productType ? `ProductType.${productData.productType}` : 'Product'
                          }`,
                        )}
                      </h1>
                      {showTabs ? (
                        <ManageProductTabs
                          setDetails={setDetails}
                          setSubProductForm={setSubProductForm}
                          manageProduct={(valueFunc?) => manageProduct(valueFunc)}
                        />
                      ) : (
                        <ManageProductSelector categories={categories} setShowTabs={setShowTabs} />
                      )}
                    </section>
                  )}
                </Basic.Provider>
              </EditSubProduct.Provider>
            </Product.Provider>
          </SuggestSendingProduct.Provider>
        </FilterAttributes.Provider>
        <ToastContainer />
      </TranslationContext.Provider>
    );
  });
})();
