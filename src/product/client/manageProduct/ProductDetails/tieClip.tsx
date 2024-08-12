import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import Select from '../../../../layouts/shared/Select';
import { TieClipDtoValidator } from '../../../models/tie-clip/tie-clip.dto.validation';
import FormControl from '../../../../layouts/shared/FormControl';

enum Field {
  Size = 'size',
  Material = 'material',
  Type = 'type',
  Color = 'color',
  Style = 'style',
  Incut = 'incut',
  GemstoneType = 'gemstoneType',
  Engraving = 'engraving',
  Packing = 'packing',
}

const TieClip: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const tr = useTranslations();
  const [gemstonesVisible, setGemstonesVisible] = useState<boolean>(!!productData.attributes?.gemstoneType);

  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(TieClipDtoValidator);

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
    register(Field.Material);
    register(Field.Type);
    register(Field.Color);
    register(Field.Style);
    register(Field.Incut);
    register(Field.GemstoneType);
    register(Field.Packing);
  }, []);

  useEffect(() => {
    if (Object.keys(productData.attributes).length > 0) {
      setValue(Field.Size, productData.attributes.size);
      setValue(Field.Material, productData.attributes.material);
      setValue(Field.Type, productData.attributes.type);
      setValue(Field.Color, productData.attributes.color);
      setValue(Field.Style, productData.attributes.style);
      setValue(Field.Incut, productData.attributes.incut);
      setValue(Field.GemstoneType, productData.attributes.gemstoneType);
      setValue(Field.Engraving, productData.attributes.engraving);
      setValue(Field.Packing, productData.attributes.packing);
    }
  }, [productData.attributes]);

  const handleData = () => {
    return;
  };

  return (
    <form ref={formRef} onSubmit={handleForm(handleData)} noValidate autoComplete="off">
      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Size')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Size)}
        options={arrayForSelect(attributes.size)}
        onChange={({ value }) => {
          setValue(Field.Size, value);
          trigger(Field.Size);
        }}
        defaultValue={productData.attributes.size}
        isSuggestProduct={isFieldSuggested(Field.Size, productData, isSuggestProduct)}
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
        defaultValue={productData.attributes.material}
        isSuggestProduct={isFieldSuggested(Field.Material, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Type')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Type)}
        options={arrayForSelect(attributes.type)}
        onChange={({ value }) => {
          setValue(Field.Type, value);
          trigger(Field.Type);
        }}
        defaultValue={productData.attributes.type}
        isSuggestProduct={isFieldSuggested(Field.Type, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Color')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Color)}
        options={arrayForSelect(attributes.color)}
        onChange={({ value }) => {
          setValue(Field.Color, value);
          trigger(Field.Color);
        }}
        defaultValue={productData.attributes.color}
        isSuggestProduct={isFieldSuggested(Field.Color, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Style')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Style)}
        options={arrayForSelect(attributes.style)}
        onChange={({ value }) => {
          setValue(Field.Style, value);
          trigger(Field.Style);
        }}
        defaultValue={productData.attributes.style}
        isSuggestProduct={isFieldSuggested(Field.Style, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Incut')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Incut)}
        options={arrayForSelect(attributes.incut)}
        onChange={({ value }) => {
          setValue(Field.Incut, value);
          trigger(Field.Incut);
        }}
        defaultValue={productData.attributes.incut}
        isSuggestProduct={isFieldSuggested(Field.Incut, productData, isSuggestProduct)}
      />

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Gemstones')}>
        <input type="checkbox" checked={gemstonesVisible} onChange={() => setGemstonesVisible(!gemstonesVisible)} />
      </FormControl>

      {gemstonesVisible && (
        <Select
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.GemstoneType')}
          defaultText={tr.get('manageProduct.Fields.Select')}
          error={errors(Field.GemstoneType)}
          options={arrayForSelect(attributes.gemstoneType)}
          onChange={({ value }) => {
            setValue(Field.GemstoneType, value);
            trigger(Field.GemstoneType);
          }}
          defaultValue={productData.attributes.gemstoneType}
          isSuggestProduct={isFieldSuggested(Field.GemstoneType, productData, isSuggestProduct)}
        />
      )}

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Engraving')}>
        <input
          type="checkbox"
          {...register(Field.Engraving)}
          defaultChecked={productData.attributes?.Engraving as boolean}
        />
      </FormControl>

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Packing')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Packing)}
        options={arrayForSelect(attributes.packing)}
        onChange={({ value }) => {
          setValue(Field.Packing, value);
          trigger(Field.Packing);
        }}
        defaultValue={productData.attributes.packing}
        isSuggestProduct={isFieldSuggested(Field.Packing, productData, isSuggestProduct)}
      />
    </form>
  );
});
export default TieClip;
