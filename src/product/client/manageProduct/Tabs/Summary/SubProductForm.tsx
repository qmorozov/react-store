import { FC, useContext, useEffect, useRef, useState } from 'react';
import { IProductData } from '../../../manageProduct.client';
import { ImageFile, ISavedFiles } from '../../../../../layouts/shared/AddImage/useAddImage';
import Details from '../Details';
import FormControl from '../../../../../layouts/shared/FormControl';
import { getCurrencySymbol } from '../../../../../payment/model/currency.info';
import Select, { ISelectOption } from '../../../../../layouts/shared/Select';
import { useFormValidation } from '../../../../../app/validation/form-validation.hook.client';
import { Basic, EditSubProduct, FilterAttributes, Product, SuggestSendingProduct } from '../../manageProductContext';
import { ProductCondition } from '../../../../models/ProductCondition.enum';
import { createSelectOptionsFromEnum } from '../General';
import { useTranslations } from '../../../../../translation/translation.context';
import { ManageProductApi } from '../../manageProduct.api.client';
import { SubProductDtoValidator, updatedProductDtoValidator } from '../../../../dto/Product.dto.validation';
import Photos from '../Photos';
import { useNotification } from '../../../../../admin/hooks/useNotification';
import { ProductType } from '../../../../models/ProductType.enum';

enum GeneralDetailsField {
  Price = 'price',
  Condition = 'condition',
  CanSuggestPrice = 'canSuggestPrice',
}

interface ISubProductForm {
  setSubProductForm: (subProductForm: boolean) => void;
}

const SubProductForm: FC<ISubProductForm> = ({ setSubProductForm }) => {
  const tr = useTranslations();

  // Generate condition array for Select component
  const conditionOptions: ISelectOption[] = createSelectOptionsFromEnum(ProductCondition, tr, 'Condition');

  // useRef To prevent rerender on useEffect
  const shouldLogRegister = useRef(true);

  // useRef For useImperativeHandle on Details and Photos components
  const photosRef = useRef(null);
  const detailsRef = useRef(null);

  // Notification function
  const { showSuccessNotification } = useNotification();

  // Functions and Data from useContext
  const { productData } = useContext(Product);
  const { product } = productData;

  const [attributes] = useContext(FilterAttributes);
  const { editSubProduct, setEditSubProduct } = useContext(EditSubProduct);
  const { setIsSendingData, isSendingData } = useContext(SuggestSendingProduct);

  // useForm Function for Price and Condition fields
  const productType: ProductType = productData.productType;
  const { register, handleSubmit, errors, setValue, trigger, getValues } = useFormValidation(SubProductDtoValidator);

  const visibility: Record<string, boolean> = updatedProductDtoValidator(productType).visibility;

  // States
  const [isSubProductAdded, setIsSubProductAdded] = useState<boolean>(false);

  // States for Photos component
  const [uploadingPhotos, setUploadingPhotos] = useState<boolean>(false);
  const [selectedPhotos, setSelectedPhotos] = useState<(ImageFile | ISavedFiles)[]>([]);

  // The main state for subProduct Data
  const [subProduct, setSubProduct] = useState<IProductData>({
    productType: productData.productType,
    product: {
      id: null,
      url: '',
      year: product.year,
      title: product.title,
      price: null,
      images: [],
      model: product.model,
      cover: '',
      rating: 0,
      brandId: product.brandId,
      description: product.description,
      serialNumber: product.serialNumber,
      suggestPrice: null,
      sex: null,
      referenceNumber: '',
      currency: product.currency,
      canSuggestPrice: false,
      condition: null,
    },
    attributes: {
      ...(editSubProduct ? editSubProduct.attributes : productData.attributes),
    },
  });

  // useEffect For register condition field
  useEffect(() => {
    if (shouldLogRegister.current) {
      shouldLogRegister.current = false;

      register(GeneralDetailsField.Condition);
    }
  }, []);

  useEffect(() => {
    setValue(GeneralDetailsField.Condition, subProduct.product.condition || null);
  }, [subProduct]);

  // Set data for edit sub product
  useEffect(() => {
    if (editSubProduct) {
      setValue(GeneralDetailsField.CanSuggestPrice, editSubProduct.product.canSuggestPrice);
      setValue(GeneralDetailsField.Condition, editSubProduct.product.condition);
      setValue(GeneralDetailsField.Price, editSubProduct.product.price);

      setSubProduct((prevData: IProductData) => ({
        ...prevData,
        product: {
          ...prevData.product,
          ...editSubProduct.product,
        },
        attributes: {
          ...prevData.attributes,
          ...editSubProduct.attributes,
        },
      }));
    }
  }, [editSubProduct]);

  const savePhotos = async () => {
    if (subProduct.product.id && selectedPhotos.length > 0) {
      await photosRef.current.uploadImages(false);

      await finishSubProduct();
    }
  };

  useEffect(() => {
    if (subProduct.product.id) {
      savePhotos();
    }
  }, [subProduct.product.id]);

  const saveSubProduct = async () => {
    if (subProduct.product.price && Object.keys(subProduct.attributes).length > 0) {
      setIsSendingData(true);
      if (editSubProduct && editSubProduct.product.id) {
        await ManageProductApi.updateProduct(subProduct.product.id, {
          product: subProduct.product,
          attributes: subProduct.attributes,
        })
          .then(() => {
            setIsSubProductAdded(true);

            savePhotos();
          })
          .catch(() => {
            setIsSendingData(false);
          });
      } else {
        await ManageProductApi.addSubProduct(productData.product.id, {
          product: subProduct.product,
          attributes: subProduct.attributes,
        }).then((productData) => {
          setSubProduct((prevData: IProductData) => ({
            ...prevData,
            product: productData.product,
            attributes: productData.attributes,
          }));

          setIsSubProductAdded(true);
        });
      }
    }
  };

  const finishSubProduct = () => {
    let isClosed = false;

    showSuccessNotification(
      `${tr.get('manageProduct.notification.SubProduct')} ${
        editSubProduct
          ? `${tr.get('manageProduct.notification.Edited')}`
          : `${tr.get('manageProduct.notification.Added')}`
      }`,
      {
        autoClose: 1300,
        onClose: () => {
          if (!isClosed) {
            setSubProductForm(false);
          }
          isClosed = true;
        },
      },
    );
  };

  const saveDetails = async (details: IProductData['attributes']) => {
    if (Object.keys(details).length > 0 && !isSubProductAdded) {
      await setSubProduct((prevData: IProductData) => ({
        ...prevData,
        attributes: details,
      }));

      saveSubProduct();
    }
  };

  const saveGeneralInfo = async (data) => {
    if (data) {
      const { price } = data;
      await setSubProduct((prevData: IProductData) => ({
        ...prevData,
        product: {
          ...prevData.product,
          price,
          condition: +getValues(GeneralDetailsField.Condition),
          canSuggestPrice: getValues(GeneralDetailsField.CanSuggestPrice),
        },
      }));
      await detailsRef.current.handleSubmit();
    }
  };

  // Close and reset subProductForm
  const closeSubProductForm = () => {
    setSubProductForm(false);
    setEditSubProduct(null);
  };

  // Close and reset subProductForm when clicking on the Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSubProductForm();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setSubProductForm, setEditSubProduct]);

  useEffect(() => {
    return () => {
      setIsSendingData(false);
    };
  }, []);

  const handleCheckboxKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setValue(GeneralDetailsField.CanSuggestPrice, !getValues(GeneralDetailsField.CanSuggestPrice));
    }
  };

  return (
    <section className={`manage-product-container --small ${isSendingData ? '--sending-data' : ''} --sub-product-form`}>
      <i className="icon icon-small-arrow" onClick={closeSubProductForm} />
      <h1 className="manage-product__title">
        {editSubProduct
          ? tr.get('manageProduct.SubProductForm.EditTitle')
          : tr.get('manageProduct.SubProductForm.AddTitle')}
      </h1>

      <Details productData={subProduct} ref={detailsRef} isSuggestProduct={false} setDetails={saveDetails} />

      <form
        id="general"
        className="manage-subproduct-general"
        onSubmit={handleSubmit(saveGeneralInfo)}
        noValidate
        autoComplete="off"
      >
        {visibility.condition && (
          <Select
            defaultText={tr.get('manageProduct.Fields.Select')}
            options={conditionOptions}
            placeholder={tr.get('manageProduct.Fields.MainInfo.Condition.title')}
            error={errors(GeneralDetailsField.Condition)}
            defaultValue={subProduct.product.condition}
            onChange={({ value }) => {
              setValue(GeneralDetailsField.Condition, +value);
              trigger(GeneralDetailsField.Condition);
            }}
          />
        )}
        {visibility.price && (
          <div
            className={`manage-product__price ${productData.product.suggestPrice > 0 ? '--suggest-price-block' : ''}`}
          >
            <div className="manage-product__price-wrapper">
              <FormControl
                type="number"
                placeholder={tr.get('manageProduct.Fields.MainInfo.Price')}
                error={errors(GeneralDetailsField.Price)}
                inputPlaceholder={productData.product.currency}
                translateParameters={{ min: attributes.price.min, max: attributes.price.max }}
              >
                <input
                  type="number"
                  max={attributes.price.max}
                  min={attributes.price.min}
                  {...register(GeneralDetailsField.Price)}
                />
              </FormControl>
              {productData.product.suggestPrice > 0 && (
                <div>
                  <div className="manage-product__price-rec">
                    <p>{tr.get('manageProduct.Fields.MainInfo.OurRecommendations')}</p>
                    <span>
                      {productData.product.suggestPrice} <i>{getCurrencySymbol(productData.product.currency)}</i>
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn --transparent"
                    onClick={() => setValue(GeneralDetailsField.Price, productData.product.suggestPrice)}
                  >
                    {tr.get('manageProduct.Fields.MainInfo.AcceptSuggestion')}
                  </button>
                </div>
              )}
            </div>

            <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.canSuggestPrice')}>
              <input
                type="checkbox"
                {...register(GeneralDetailsField.CanSuggestPrice)}
                onKeyDown={handleCheckboxKeyDown}
                defaultChecked={productData.product.canSuggestPrice}
              />
            </FormControl>
          </div>
        )}
      </form>

      <Photos
        ref={photosRef}
        productData={subProduct}
        setProductData={setSubProduct}
        setSelectedPhotos={setSelectedPhotos}
        setUploadingPhotos={setUploadingPhotos}
      />

      <button
        form="general"
        type="submit"
        className="btn --primary"
        onClick={saveGeneralInfo}
        disabled={uploadingPhotos && !isSendingData}
      >
        {editSubProduct
          ? tr.get('manageProduct.SubProductForm.EditTitle')
          : tr.get('manageProduct.SubProductForm.AddTitle')}
      </button>
    </section>
  );
};

export default SubProductForm;
