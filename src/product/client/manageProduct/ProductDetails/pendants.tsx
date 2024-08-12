import { FC, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import Select from '../../../../layouts/shared/Select';
import { PendantsDtoValidator } from '../../../models/pendants/pendants.dto.validation';
import FormControl from '../../../../layouts/shared/FormControl';

enum Field {
  Size = 'size',
  Type = 'type',
  Coating = 'coating',
  Material = 'material',
  Color = 'color',
  GemstonesQuantity = 'gemstonesQuantity',
  Gemstones = 'gemstones',
  MixedStones = 'mixedStones',
  LargeStones = 'largeStones',
  GemstoneColor = 'gemstoneColor',
  Incut = 'incut',
  IncutColor = 'incutColor',
  Packing = 'packing',
}

const Pendants: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const tr = useTranslations();

  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(PendantsDtoValidator);

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
    register(Field.Type);
    register(Field.Coating);
    register(Field.Material);
    register(Field.Color);
    register(Field.GemstonesQuantity);
    register(Field.Gemstones);
    register(Field.GemstoneColor);
    register(Field.IncutColor);
    register(Field.Packing);
  }, []);

  useEffect(() => {
    if (Object.keys(productData.attributes).length > 0) {
      setValue(Field.Size, productData.attributes.size);
      setValue(Field.Type, productData.attributes.type);
      setValue(Field.Coating, productData.attributes.coating);
      setValue(Field.Material, productData.attributes.material);
      setValue(Field.Color, productData.attributes.color);
      setValue(Field.GemstonesQuantity, productData.attributes.gemstonesQuantity);
      setValue(Field.Gemstones, productData.attributes.gemstones);
      setValue(Field.MixedStones, productData.attributes.mixedStones);
      setValue(Field.LargeStones, productData.attributes.largeStones);
      setValue(Field.GemstoneColor, productData.attributes.gemstoneColor);
      setValue(Field.Incut, productData.attributes.incut);
      setValue(Field.IncutColor, productData.attributes.incutColor);
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
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Coating')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Coating)}
        options={arrayForSelect(attributes.coating)}
        onChange={({ value }) => {
          setValue(Field.Coating, value);
          trigger(Field.Coating);
        }}
        defaultValue={productData.attributes.coating}
        isSuggestProduct={isFieldSuggested(Field.Coating, productData, isSuggestProduct)}
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
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.GemstonesQuantity')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.GemstonesQuantity)}
        options={arrayForSelect(attributes.gemstonesQuantity)}
        onChange={({ value }) => {
          setValue(Field.GemstonesQuantity, value);
          trigger(Field.GemstonesQuantity);
        }}
        defaultValue={productData.attributes.gemstonesQuantity}
        isSuggestProduct={isFieldSuggested(Field.GemstonesQuantity, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Gemstones')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Gemstones)}
        options={arrayForSelect(attributes.gemstones)}
        onChange={({ value }) => {
          setValue(Field.Gemstones, value);
          trigger(Field.Gemstones);
        }}
        defaultValue={productData.attributes.gemstones}
        isSuggestProduct={isFieldSuggested(Field.Gemstones, productData, isSuggestProduct)}
      />

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.MixedStones')}>
        <input
          type="checkbox"
          {...register(Field.MixedStones)}
          defaultChecked={productData.attributes?.mixedStones as boolean}
        />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.LargeStones')}>
        <input
          type="checkbox"
          {...register(Field.LargeStones)}
          defaultChecked={productData.attributes?.largeStones as boolean}
        />
      </FormControl>

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.GemstoneColor')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.GemstoneColor)}
        options={arrayForSelect(attributes.gemstoneColor)}
        onChange={({ value }) => {
          setValue(Field.GemstoneColor, value);
          trigger(Field.GemstoneColor);
        }}
        defaultValue={productData.attributes.gemstoneColor}
        isSuggestProduct={isFieldSuggested(Field.GemstoneColor, productData, isSuggestProduct)}
      />

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Incut')}>
        <input type="checkbox" {...register(Field.Incut)} defaultChecked={productData.attributes?.incut as boolean} />
      </FormControl>

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.IncutColor')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.IncutColor)}
        options={arrayForSelect(attributes.incutColor)}
        onChange={({ value }) => {
          setValue(Field.IncutColor, value);
          trigger(Field.IncutColor);
        }}
        defaultValue={productData.attributes.incutColor}
        isSuggestProduct={isFieldSuggested(Field.IncutColor, productData, isSuggestProduct)}
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
export default Pendants;
