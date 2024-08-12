import { FC, FormEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import Select from '../../../../layouts/shared/Select';
import { PinsBroochesDtoValidator } from '../../../models/PinsBrooches/pinsBrooches.dto.validation';
import FormControl from '../../../../layouts/shared/FormControl';

enum Field {
  Size = 'size',
  Type = 'type',
  GemstoneType = 'gemstoneType',
  Packing = 'packing',
  Material = 'material',
}

const PinsBrooches: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const tr = useTranslations();

  const [isGemstoneType, setIsGemstoneType] = useState(false);

  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(PinsBroochesDtoValidator);

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
    register(Field.GemstoneType);
    register(Field.Packing);
    register(Field.Material);
  }, []);

  useEffect(() => {
    if (Object.keys(productData.attributes).length > 0) {
      setValue(Field.Size, Number(productData.attributes.size));
      setValue(Field.Material, productData.attributes.material);
      setValue(Field.Type, productData.attributes.type);
      setValue(Field.GemstoneType, productData.attributes.gemstoneType);
      setValue(Field.Packing, productData.attributes.packing);
    }
  }, [productData.attributes]);

  const handleData = () => {
    return;
  };

  return (
    <form ref={formRef} onSubmit={handleForm(handleData)} noValidate autoComplete="off">
      <FormControl
        type="number"
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Size')}
        error={errors(Field.Size)}
        isSuggestProduct={isFieldSuggested(Field.Size, productData, isSuggestProduct)}
        translateParameters={{ min: attributes.size.min, max: attributes.size.max }}
      >
        <input
          type="number"
          {...register(Field.Size)}
          max={attributes.size.max}
          min={attributes.size.min}
          onInput={(event: FormEvent<HTMLInputElement>) => {
            setValue(Field.Size, (event.target as HTMLInputElement).value);
            trigger(Field.Size);
          }}
        />
      </FormControl>

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

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Gemstone')}>
        <input type="checkbox" checked={isGemstoneType} onChange={() => setIsGemstoneType(!isGemstoneType)} />
      </FormControl>

      {isGemstoneType && (
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
export default PinsBrooches;
