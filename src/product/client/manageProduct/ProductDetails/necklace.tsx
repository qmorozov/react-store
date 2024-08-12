import { FC, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import { NecklaceDtoValidator } from '../../../models/necklace/necklace.dto.validation';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import Select from '../../../../layouts/shared/Select';
import type { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';

enum Field {
  CoatingColor = 'coating_color',
  Material = 'material',
  Size = 'size',
  Stones = 'stones',
}

const Necklace: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const tr = useTranslations();

  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(NecklaceDtoValidator);

  const formRef = useRef<HTMLFormElement>(null);

  useImperativeHandle(ref, () => ({
    handleSubmit: (onSubmit?: () => void) => {
      return trigger().then(async (isValid) => {
        if (isValid) {
          const formData = getValues();
          await setDetails(formData);
          if (onSubmit) {
            onSubmit();
          }
        }
      });
    },
    isValid: trigger,
  }));

  useEffect(() => {
    register(Field.Size);
    register(Field.Stones);
    register(Field.Material);
    register(Field.CoatingColor);
  }, []);

  useEffect(() => {
    if (productData.attributes) {
      setValue(Field.Size, productData.attributes.size);
      setValue(Field.Stones, productData.attributes.stones);
      setValue(Field.Material, productData.attributes.material);
      setValue(Field.CoatingColor, productData.attributes.coating_color);
    }
  }, [productData.attributes]);

  const handleData = () => {
    return;
  };

  return (
    <form ref={formRef} onSubmit={handleForm(handleData)} noValidate autoComplete="off">
      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.CoatingColor')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.CoatingColor)}
        options={arrayForSelect(attributes.coating_color)}
        onChange={({ value }) => {
          setValue(Field.CoatingColor, value);
          trigger(Field.CoatingColor);
        }}
        defaultValue={productData.attributes?.coating_color}
        isSuggestProduct={isFieldSuggested(Field.CoatingColor, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Material')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Material)}
        options={arrayForSelect(attributes.material)}
        onChange={({ value }) => {
          setValue(Field.Material, value);
          trigger(Field.Material);
        }}
        defaultValue={productData.attributes?.material}
        isSuggestProduct={isFieldSuggested(Field.Material, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Size')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Size)}
        options={arrayForSelect(attributes.size)}
        onChange={({ value }) => {
          setValue(Field.Size, value);
          trigger(Field.Size);
        }}
        defaultValue={productData.attributes?.size}
        isSuggestProduct={isFieldSuggested(Field.Size, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Stone')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Stones)}
        options={arrayForSelect(attributes.stones)}
        onChange={({ value }) => {
          setValue(Field.Stones, value);
          trigger(Field.Stones);
        }}
        defaultValue={productData.attributes?.stones}
        isSuggestProduct={isFieldSuggested(Field.Stones, productData, isSuggestProduct)}
      />
    </form>
  );
});

export default Necklace;
