import { forwardRef, useContext, useEffect, useImperativeHandle } from 'react';
import { isFieldSuggested } from '../../manageProduct.client';
import { useTranslations } from '../../../../translation/translation.context';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import { Basic, FilterAttributes, Product } from '../manageProductContext';
import { currency } from '../../mocks/currency';
import { ProductSex } from '../../../models/Product.sex.enum';
import { updatedProductDtoValidator } from '../../../dto/Product.dto.validation';
import { TabsEnum } from '../manageProductTabs';
import { getCurrencySymbol } from '../../../../payment/model/currency.info';
import Select, { ISelectOption } from '../../../../layouts/shared/Select';
import { ProductCondition } from '../../../models/ProductCondition.enum';
import FormControl from '../../../../layouts/shared/FormControl';
import Loader from '../../../../layouts/shared/Loader';
import { GeneralField, ProductType } from '../../../models/ProductType.enum';

interface IMainInfo {
  isSuggestProduct: boolean;
}

export const createSelectOptionsFromEnum = (enumObject: any, translation: any, field: string): ISelectOption[] => {
  const selectOptions: ISelectOption[] = Object.keys(enumObject)
    .filter((key: string) => isNaN(parseInt(key)))
    .map((key: string) => {
      const value = enumObject[key].toString();
      const label = translation.get(`manageProduct.Fields.MainInfo.${field}.${[key]}`);
      return { id: enumObject[key], value, label };
    });
  return selectOptions;
};

const General = forwardRef(({ isSuggestProduct }: IMainInfo, ref) => {
  const tr = useTranslations();

  const { productData, setProductData } = useContext(Product);

  const [attributes] = useContext(FilterAttributes);
  const { setVisibleTabs, setStep, showCustomFeatures, setShowCustomFeatures } = useContext(Basic);

  const productType: ProductType = productData.productType || ProductType.Watch;

  const { register, handleSubmit, errors, setValue, getValues, trigger } = useFormValidation(
    updatedProductDtoValidator(productType).validation,
  );

  const sexOptions: ISelectOption[] = createSelectOptionsFromEnum(ProductSex, tr, 'Sex');
  const conditionOptions: ISelectOption[] = createSelectOptionsFromEnum(ProductCondition, tr, 'Condition');

  if (Object.keys(attributes).length < 0) {
    return null;
  }

  useEffect(() => {
    if (visibility.Currency) {
      register(GeneralField.Currency);
    }
    if (visibility.Condition) {
      register(GeneralField.Condition);
    }
    register(GeneralField.BrandId);
    if (visibility.Sex) {
      register(GeneralField.Sex);
    }
  }, []);

  useEffect(() => {
    if (productData.product && Object.keys(attributes).length > 0) {
      setValue(GeneralField.Title, productData.product.title || '');
      setValue(GeneralField.Price, productData.product.price || '');
      setValue(GeneralField.Model, productData.product.model || '');
      setValue(GeneralField.Description, productData.product.description || '');
      setValue(GeneralField.SerialNumber, productData.product.serialNumber || null);
      setValue(GeneralField.Year, productData.product.year || attributes?.year.max);
      setValue(GeneralField.Currency, productData.product.currency || currency[0].value);
      setValue(
        GeneralField.BrandId,
        attributes.brand.length < 2 ? attributes.brand[0].id : productData.product.brandId,
      );
      setValue(GeneralField.Sex, productData.product.sex || null);
      setValue(GeneralField.Condition, productData.product.condition || null);
      setValue(GeneralField.CanSuggestPrice, productData.product.canSuggestPrice);

      setValue(GeneralField.ReferenceNumber, productData.product.referenceNumber || '');
      setValue(GeneralField.CustomFeatures, productData.product.customFeatures || null);

      if (productData.product.customFeatures) setShowCustomFeatures(true);
    }
  }, [productData.product, attributes, getValues]);

  const handleMainInfo = (data) => {
    const { year, title, model, price, description, serialNumber, referenceNumber, customFeatures } = data;

    let updatedCustomFeatures = customFeatures;
    if (!showCustomFeatures) {
      updatedCustomFeatures = null;
    }

    setProductData((prevData) => ({
      ...prevData,
      product: {
        ...prevData.product,
        title,
        model,
        year: +year,
        description,
        serialNumber,
        price: +price,
        sex: getValues(GeneralField.Sex),
        canSuggestPrice: getValues(GeneralField.CanSuggestPrice),
        brandId: +getValues(GeneralField.BrandId),
        currency: getValues(GeneralField.Currency),
        condition: +getValues(GeneralField.Condition),
        referenceNumber,
        customFeatures: updatedCustomFeatures,
      },
    }));
  };

  useEffect(() => {
    setStep(TabsEnum.general);
  }, []);

  const handleButtonClick = async (redirect = false) => {
    const isValid = await trigger();
    await handleSubmit(handleMainInfo)();

    if (isValid) {
      if (redirect) {
        setStep(TabsEnum.details);
        setVisibleTabs((prevState) => ({
          ...prevState,
          [TabsEnum.details]: false,
        }));
      }
    }
  };

  useEffect(() => {
    return () => {
      handleSubmit(handleMainInfo)();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    handleButtonClick,
    isValid: async () => {
      const isValid = await trigger();
      return isValid;
    },
  }));

  const handleCheckboxKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setValue(GeneralField.CanSuggestPrice, !getValues(GeneralField.CanSuggestPrice));
    }
  };

  const visibility: Record<string, boolean> = updatedProductDtoValidator(productType).visibility;

  return (
    <>
      <h2 className="form__title">{tr.get('manageProduct.tabsTitle.general')}</h2>
      {Object.keys(attributes).length > 0 ? (
        <>
          <form noValidate autoComplete="off">
            {visibility.title && (
              <FormControl
                placeholder={tr.get('manageProduct.Fields.MainInfo.Title')}
                error={errors(GeneralField.Title)}
                isSuggestProduct={isFieldSuggested(GeneralField.Title, productData, isSuggestProduct)}
              >
                <input {...register(GeneralField.Title)} autoFocus={productData.product.title === ''} />
              </FormControl>
            )}

            {visibility.description && (
              <FormControl
                placeholder={tr.get('manageProduct.Fields.MainInfo.Description')}
                error={errors(GeneralField.Description)}
                isSuggestProduct={isFieldSuggested(GeneralField.Description, productData, isSuggestProduct)}
              >
                <textarea {...register(GeneralField.Description)} />
              </FormControl>
            )}

            {visibility.customFeatures && (
              <div className="form-group__close">
                <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.MainInfo.CustomFeatures')}>
                  <input
                    type="checkbox"
                    checked={showCustomFeatures}
                    onChange={() => setShowCustomFeatures(!showCustomFeatures)}
                  />
                </FormControl>
                <span
                  className="tooltip"
                  data-tooltip=" Select this option if your watches are customized. Please, describe your customization below."
                ></span>
              </div>
            )}

            {showCustomFeatures && (
              <FormControl
                error={errors(GeneralField.Description)}
                placeholder={tr.get('manageProduct.Fields.MainInfo.CustomFeatures')}
              >
                <textarea {...register(GeneralField.CustomFeatures)} />
              </FormControl>
            )}

            {visibility.sex && (
              <Select
                defaultText={tr.get('manageProduct.Fields.Select')}
                options={sexOptions}
                defaultValue={productData.product.sex}
                onChange={({ value }) => {
                  setValue(GeneralField.Sex, +value);
                  trigger(GeneralField.Sex);
                }}
                placeholder={tr.get('manageProduct.Fields.MainInfo.Sex.title')}
                error={errors(GeneralField.Sex)}
                isSuggestProduct={isFieldSuggested(GeneralField.Sex, productData, isSuggestProduct)}
              />
            )}

            {attributes.brand.length > 2 && (
              <Select
                defaultText={tr.get('manageProduct.Fields.Select')}
                options={attributes.brand.map(({ id, url, name }) => ({
                  id,
                  value: url,
                  label: name,
                }))}
                placeholder={tr.get('manageProduct.Fields.MainInfo.Brand')}
                error={errors(GeneralField.BrandId)}
                onChange={({ id }) => {
                  setValue(GeneralField.BrandId, id);
                  trigger(GeneralField.BrandId);
                }}
                defaultValue={productData.product.brandId}
                isSuggestProduct={isFieldSuggested(GeneralField.BrandId, productData, isSuggestProduct)}
              />
            )}

            {visibility.condition && (
              <Select
                defaultText={tr.get('manageProduct.Fields.Select')}
                options={conditionOptions}
                placeholder={tr.get('manageProduct.Fields.MainInfo.Condition.title')}
                error={errors(GeneralField.Condition)}
                defaultValue={productData.product.condition}
                onChange={({ value }) => {
                  setValue(GeneralField.Condition, +value);
                  trigger(GeneralField.Condition);
                }}
                isSuggestProduct={isFieldSuggested(GeneralField.Condition, productData, isSuggestProduct)}
              />
            )}

            <div className="form-group__fields">
              {visibility.model && (
                <FormControl
                  placeholder={tr.get('manageProduct.Fields.MainInfo.Model')}
                  error={errors(GeneralField.Model)}
                  isSuggestProduct={isFieldSuggested(GeneralField.Model, productData, isSuggestProduct)}
                >
                  <input {...register(GeneralField.Model)} />
                </FormControl>
              )}

              {visibility.referenceNumber && (
                <FormControl
                  error={errors(GeneralField.ReferenceNumber)}
                  placeholder={tr.get('manageProduct.Fields.MainInfo.ReferenceNumber')}
                >
                  <input {...register(GeneralField.ReferenceNumber)} />
                </FormControl>
              )}
            </div>

            <div className="form-group__fields">
              {visibility.serialNumber && (
                <FormControl
                  placeholder={tr.get('manageProduct.Fields.MainInfo.SerialNumber')}
                  error={errors(GeneralField.SerialNumber)}
                  isSuggestProduct={isFieldSuggested(GeneralField.SerialNumber, productData, isSuggestProduct)}
                >
                  <input {...register(GeneralField.SerialNumber)} />
                </FormControl>
              )}

              {visibility.year && (
                <FormControl
                  type="number"
                  placeholder={tr.get('manageProduct.Fields.MainInfo.Year')}
                  error={errors(GeneralField.Year)}
                  translateParameters={{ min: attributes.year.min, max: attributes.year.max }}
                  isSuggestProduct={isFieldSuggested(GeneralField.Year, productData, isSuggestProduct)}
                >
                  <input
                    type="number"
                    max={attributes.year.max}
                    min={attributes.year.min}
                    {...register(GeneralField.Year)}
                  />
                </FormControl>
              )}
            </div>

            {visibility.price && (
              <div
                className={`manage-product__price ${
                  productData.product.suggestPrice > 0 ? '--suggest-price-block' : ''
                }`}
              >
                <div className="manage-product__price-wrapper">
                  <FormControl
                    type="number"
                    placeholder={tr.get('manageProduct.Fields.MainInfo.Price')}
                    error={errors(GeneralField.Price)}
                    translateParameters={{ min: attributes.price.min, max: attributes.price.max }}
                    inputPlaceholder={productData.product.currency}
                    isSuggestProduct={isFieldSuggested(GeneralField.Price, productData, isSuggestProduct)}
                  >
                    <input
                      type="number"
                      max={attributes.price.max}
                      min={attributes.price.min}
                      {...register(GeneralField.Price)}
                    />
                  </FormControl>
                  {productData.product.suggestPrice > 0 && (
                    <div>
                      <div className="manage-product__price-rec">
                        <p>{tr.get('manageProduct.Fields.MainInfo.OurRecommendations')}</p>
                        <span>
                          {productData.product.suggestPrice.toFixed(2)}
                          <i> {getCurrencySymbol(productData.product.currency)}</i>
                        </span>
                      </div>

                      <button
                        type="button"
                        className="btn --transparent"
                        onClick={() => setValue(GeneralField.Price, productData.product.suggestPrice.toFixed(2))}
                      >
                        {tr.get('manageProduct.Fields.MainInfo.AcceptSuggestion')}
                      </button>
                    </div>
                  )}
                </div>

                <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.canSuggestPrice')}>
                  <input
                    type="checkbox"
                    {...register(GeneralField.CanSuggestPrice)}
                    onKeyDown={handleCheckboxKeyDown}
                    defaultChecked={productData.product.canSuggestPrice}
                  />
                </FormControl>
              </div>
            )}
          </form>

          <button className="btn --primary" type="button" onClick={() => handleButtonClick(true)}>
            {tr.get('manageProduct.next')}: {tr.get('manageProduct.tabsTitle.details')}
          </button>
        </>
      ) : (
        <Loader relative />
      )}
    </>
  );
});

export default General;
