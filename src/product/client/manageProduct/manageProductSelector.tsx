import { FC, memo, useCallback, useContext, useEffect, useState } from 'react';
import { RadioGroup } from '@headlessui/react';
import { ManageProductApi } from './manageProduct.api.client';
import Combobox from '../../../layouts/shared/Combobox';
import { Product, SuggestSendingProduct } from './manageProductContext';
import { useNotification } from '../../../admin/hooks/useNotification';
import { useTranslations } from '../../../translation/translation.context';

export interface ICategory {
  id: number;
  url: string;
  name: string;
  productType: string;
}

interface ISuggest {
  type: string;
  brandId: number;
  brand: string;
  model: string;
}

interface IManageProductSelector {
  categories: ICategory[];
  setShowTabs: (showTabs: boolean) => void;
}

const ManageProductSelector: FC<IManageProductSelector> = memo(({ categories, setShowTabs }) => {
  const tr = useTranslations();

  const { productData, setProductData } = useContext(Product);
  const { setIsSuggestProduct } = useContext(SuggestSendingProduct);
  const { showErrorNotification } = useNotification();

  const [category, setCategory] = useState<ICategory>(categories[0]);
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [comboboxOptions, setComboboxOptions] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ISuggest>({
    type: '',
    brandId: 0,
    brand: '',
    model: '',
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length < 3) {
        setComboboxOptions([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await ManageProductApi.suggestProducts(category.productType, query);
        const newOptionsArray = data.map((item) => ({
          value: item,
          label: `${item.brand} ${item.model}`,
        }));

        if (!data.length) {
          showErrorNotification(tr.get('manageProduct.notification.NothingFound'), {
            autoClose: 400,
          });
        }

        setComboboxOptions(newOptionsArray);
      } catch (error) {
        console.error(error);
        setComboboxOptions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [category, query]);

  const handleManageProductSelector = useCallback(
    async (event) => {
      event.preventDefault();

      setProductData((prevState) => ({
        ...prevState,
        productType: category.productType,
      }));

      setShowTabs(true);

      if (query.trim() !== '' && selectedProduct.type && selectedProduct.brandId && selectedProduct.model) {
        try {
          const data = await ManageProductApi.suggestProductAttributes(
            selectedProduct.type,
            selectedProduct.model,
            selectedProduct.brandId,
          );
          const { product, attributes } = data;
          setProductData((prevState) => ({
            ...prevState,
            product: {
              ...prevState.product,
              suggestPrice: product.price,
              brandId: product.brandId,
              year: product.year,
              sex: product.sex,
              model: product.model,
            },
            attributes: attributes,
          }));
          setIsSuggestProduct(true);
        } catch (error) {
          console.error(error);
        }
      }
    },
    [category, query, selectedProduct, setProductData, setShowTabs],
  );

  useEffect(() => {
    if (!productData.productType && categories.length > 0) {
      setProductData((prevState) => ({
        ...prevState,
        productType: categories[0].productType,
      }));
    }
  }, []);

  const resetStates = () => {
    setQuery('');
    setComboboxOptions([]);
    setSelectedProduct({
      type: '',
      brandId: 0,
      brand: '',
      model: '',
    });
    setProductData((prevState) => ({
      ...prevState,
      productType: category.productType,
      product: {
        ...prevState.product,
        suggestPrice: null,
        brandId: null,
        year: null,
        sex: null,
        model: null,
      },
      attributes: [],
    }));
    setIsSuggestProduct(false);
  };

  return (
    <>
      <form noValidate autoComplete="off" onSubmit={handleManageProductSelector} id="manage-product-form">
        <div className="product__categories">
          <span className="form-label__placeholder">{tr.get('manageProduct.manageProductSelector.groupTitle')}:</span>
          <RadioGroup
            as="div"
            defaultValue={category}
            onChange={(value) => {
              resetStates();
              setCategory(value);
              setProductData((prevState) => ({
                ...prevState,
                productType: value.productType,
              }));
            }}
          >
            {categories.map((categoryItem) => (
              <RadioGroup.Option key={categoryItem.id} as="button" type="button" value={categoryItem}>
                {categoryItem.name}
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div>

        <Combobox
          autoFocus={true}
          options={comboboxOptions}
          placeholder={tr.get('manageProduct.manageProductSelector.comboboxPlaceholder')}
          onSelect={(value: ISuggest) => setSelectedProduct(value)}
          onQueryChange={(value: string) => setQuery(value)}
        />
      </form>

      <button className="btn --primary" disabled={isLoading} form="manage-product-form">
        {isLoading
          ? `${tr.get('manageProduct.manageProductSelector.searching')}...`
          : `${tr.get('manageProduct.next')}: ${tr.get('manageProduct.manageProductSelector.button')}`}
      </button>
    </>
  );
});

export default ManageProductSelector;
