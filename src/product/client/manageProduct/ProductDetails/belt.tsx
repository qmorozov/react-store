import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import { BeltDtoValidator } from '../../../models/belt/belt.dto.validation';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import Select from '../../../../layouts/shared/Select';
import type { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';
import FormControl from '../../../../layouts/shared/FormControl';

enum Field {
  Type = 'type',
  Clasp = 'clasp',
  Color = 'color',
  Material = 'material',
  BeltLength = 'belt_length',
  CombinedMaterials = 'combined_materials',
}

const Belt: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const tr = useTranslations();

  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(BeltDtoValidator);

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
    register(Field.Type);
    register(Field.Color);
    register(Field.Clasp);
    register(Field.Material);
    register(Field.BeltLength);
    register(Field.CombinedMaterials);
  }, []);

  useEffect(() => {
    if (productData.attributes) {
      setValue(Field.Type, productData.attributes.type);
      setValue(Field.Clasp, productData.attributes.clasp);
      setValue(Field.Color, productData.attributes.color);
      setValue(Field.Material, productData.attributes.material);
      setValue(Field.BeltLength, productData.attributes.belt_length);
      setValue(Field.CombinedMaterials, productData.attributes.combined_materials);
    }
  }, [productData.attributes]);

  const handleData = () => {
    return;
  };

  return (
    <form ref={formRef} onSubmit={handleForm(handleData)} noValidate autoComplete="off">
      <Select
        defaultText={tr.get('manageProduct.Fields.Select')}
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.BeltLength')}
        error={errors(Field.BeltLength)}
        options={arrayForSelect(attributes.belt_length)}
        onChange={({ value }) => {
          setValue(Field.BeltLength, value);
          trigger(Field.BeltLength);
        }}
        defaultValue={productData.attributes.belt_length}
        isSuggestProduct={isFieldSuggested(Field.BeltLength, productData, isSuggestProduct)}
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
        defaultValue={productData.attributes.clasp}
        isSuggestProduct={isFieldSuggested(Field.Clasp, productData, isSuggestProduct)}
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
        defaultValue={productData.attributes?.color}
        isSuggestProduct={isFieldSuggested(Field.Color, productData, isSuggestProduct)}
      />
      <Select
        defaultText={tr.get('manageProduct.Fields.Select')}
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Material')}
        error={errors(Field.Material)}
        options={arrayForSelect(attributes.material)}
        onChange={({ value }) => {
          setValue(Field.Material, value);
          trigger(Field.Material);
        }}
        defaultValue={productData.attributes?.material}
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
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Type')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Type)}
        options={arrayForSelect(attributes.type)}
        onChange={({ value }) => {
          setValue(Field.Type, value);
          trigger(Field.Type);
        }}
        defaultValue={productData.attributes?.type}
        isSuggestProduct={isFieldSuggested(Field.Type, productData, isSuggestProduct)}
      />
    </form>
  );
});

export default Belt;
