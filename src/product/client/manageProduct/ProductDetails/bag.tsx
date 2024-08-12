import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import { BagDtoValidator } from '../../../models/bag/bag.dto.validation';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import Select from '../../../../layouts/shared/Select';
import type { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';
import FormControl from '../../../../layouts/shared/FormControl';

enum Field {
  Kind = 'kind',
  Style = 'style',
  Color = 'color',
  Clasp = 'clasp',
  Size = 'size',
  Shape = 'shape',
  Material = 'material',
  CombinedMaterials = 'combined_materials',
}

const Bag: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const tr = useTranslations();

  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(BagDtoValidator);

  const [combinedMaterials, setCombinedMaterials] = useState<boolean>(!!productData.attributes?.combined_materials);

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
    register(Field.Kind);
    register(Field.Style);
    register(Field.Color);
    register(Field.Clasp);
    register(Field.Shape);
    register(Field.Material);
    register(Field.CombinedMaterials);
  }, []);

  useEffect(() => {
    if (productData.attributes) {
      setValue(Field.Size, productData.attributes.size);
      setValue(Field.Kind, productData.attributes.kind);
      setValue(Field.Style, productData.attributes.style);
      setValue(Field.Color, productData.attributes.color);
      setValue(Field.Clasp, productData.attributes.clasp);
      setValue(Field.Shape, productData.attributes.shape);
      setValue(Field.Material, productData.attributes.material);
      setValue(Field.CombinedMaterials, productData.attributes.combined_materials);
    }
  }, [productData.attributes]);

  const handleData = () => {
    return;
  };

  return (
    <form ref={formRef} onSubmit={handleForm(handleData)} noValidate autoComplete="off">
      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Kind')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Kind)}
        options={arrayForSelect(attributes.kind)}
        defaultValue={productData.attributes.kind}
        onChange={({ value }) => {
          setValue(Field.Kind, value);
          trigger(Field.Kind);
        }}
        isSuggestProduct={isFieldSuggested(Field.Kind, productData, isSuggestProduct)}
      />

      <Select
        defaultText={tr.get('manageProduct.Fields.Select')}
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Material')}
        error={errors(Field.Material)}
        options={arrayForSelect(attributes.material)}
        defaultValue={productData.attributes?.material}
        onChange={({ value }) => {
          setValue(Field.Material, value);
          trigger(Field.Material);
        }}
        isSuggestProduct={isFieldSuggested(Field.Material, productData, isSuggestProduct)}
      />

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.CombinedMaterials')}>
        <input type="checkbox" checked={combinedMaterials} onChange={() => setCombinedMaterials(!combinedMaterials)} />
      </FormControl>

      {combinedMaterials && (
        <Select
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.CombinedMaterials')}
          defaultText={tr.get('manageProduct.Fields.Select')}
          error={errors(Field.CombinedMaterials)}
          options={arrayForSelect(attributes.material)}
          onChange={({ value }) => {
            setValue(Field.CombinedMaterials, value || '');
            trigger(Field.CombinedMaterials);
          }}
          defaultValue={productData.attributes.combined_materials}
          isSuggestProduct={isFieldSuggested(Field.CombinedMaterials, productData, isSuggestProduct)}
        />
      )}

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Style')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Style)}
        options={arrayForSelect(attributes.style)}
        defaultValue={productData.attributes?.style}
        onChange={({ value }) => {
          setValue(Field.Style, value);
          trigger(Field.Style);
        }}
        isSuggestProduct={isFieldSuggested(Field.Style, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Color')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Color)}
        options={arrayForSelect(attributes.color)}
        defaultValue={productData.attributes?.color}
        onChange={({ value }) => {
          setValue(Field.Color, value);
          trigger(Field.Color);
        }}
        isSuggestProduct={isFieldSuggested(Field.Color, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Size')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Size)}
        options={arrayForSelect(attributes.size)}
        defaultValue={productData.attributes?.size}
        onChange={({ value }) => {
          setValue(Field.Size, value);
          trigger(Field.Size);
        }}
        isSuggestProduct={isFieldSuggested(Field.Size, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Shape')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Shape)}
        options={arrayForSelect(attributes.shape)}
        defaultValue={productData.attributes?.shape}
        onChange={({ value }) => {
          setValue(Field.Shape, value);
          trigger(Field.Shape);
        }}
        isSuggestProduct={isFieldSuggested(Field.Shape, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Clasp')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Clasp)}
        options={arrayForSelect(attributes.clasp)}
        onChange={({ value }) => {
          setValue(Field.Clasp, value);
          trigger(Field.Clasp);
        }}
        defaultValue={productData.attributes?.clasp}
        isSuggestProduct={isFieldSuggested(Field.Clasp, productData, isSuggestProduct)}
      />
    </form>
  );
});

export default Bag;
