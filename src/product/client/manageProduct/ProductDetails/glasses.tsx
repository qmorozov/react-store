import { FC, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import { GlassesDtoValidator } from '../../../models/glasses/glasses.dto.validation';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import Select from '../../../../layouts/shared/Select';
import type { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';

enum Field {
  FrameShape = 'frame_shape',
  FrameColor = 'frame_color',
  LensesColor = 'lenses_color',
  FrameMaterial = 'frame_material',
}

const Glasses: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const tr = useTranslations();

  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(GlassesDtoValidator);

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
    register(Field.FrameShape);
    register(Field.FrameColor);
    register(Field.LensesColor);
    register(Field.FrameMaterial);
  }, []);

  useEffect(() => {
    if (productData.attributes) {
      setValue(Field.FrameShape, productData.attributes.frame_shape);
      setValue(Field.FrameColor, productData.attributes.frame_color);
      setValue(Field.LensesColor, productData.attributes.lenses_color);
      setValue(Field.FrameMaterial, productData.attributes.frame_material);
    }
  }, [productData.attributes]);

  const handleData = () => {
    return;
  };

  return (
    <form ref={formRef} onSubmit={handleForm(handleData)} noValidate autoComplete="off">
      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.FrameShape')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.FrameShape)}
        options={arrayForSelect(attributes.frame_shape)}
        onChange={({ value }) => {
          setValue(Field.FrameShape, value);
          trigger(Field.FrameShape);
        }}
        defaultValue={productData.attributes?.frame_shape}
        isSuggestProduct={isFieldSuggested(Field.FrameShape, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.FrameMaterial')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.FrameMaterial)}
        options={arrayForSelect(attributes.frame_material)}
        onChange={({ value }) => {
          setValue(Field.FrameMaterial, value);
          trigger(Field.FrameMaterial);
        }}
        defaultValue={productData.attributes?.frame_material}
        isSuggestProduct={isFieldSuggested(Field.FrameMaterial, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.FrameColor')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.FrameColor)}
        options={arrayForSelect(attributes.frame_color)}
        onChange={({ value }) => {
          setValue(Field.FrameColor, value);
          trigger(Field.FrameMaterial);
        }}
        defaultValue={productData.attributes?.frame_color}
        isSuggestProduct={isFieldSuggested(Field.FrameColor, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.LensesColor')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.LensesColor)}
        options={arrayForSelect(attributes.lenses_color)}
        onChange={({ value }) => {
          setValue(Field.LensesColor, value);
          trigger(Field.FrameColor);
        }}
        defaultValue={productData.attributes?.lenses_color}
        isSuggestProduct={isFieldSuggested(Field.LensesColor, productData, isSuggestProduct)}
      />
    </form>
  );
});

export default Glasses;
