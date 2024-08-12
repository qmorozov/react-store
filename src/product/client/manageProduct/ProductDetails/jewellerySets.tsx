import { FC, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import Select from '../../../../layouts/shared/Select';
import { JewellerySetsDtoValidator } from '../../../models/jewellery-sets/jewellery-sets.dto.validation';
import FormControl from '../../../../layouts/shared/FormControl';

enum Field {
  Necklace = 'necklace',
  Earrings = 'earrings',
  Brooch = 'brooch',
  Bracelet = 'bracelet',
  Diadem = 'diadem',
  Ring = 'ring',
  Pendant = 'pendant',
  Size = 'size',
  Material = 'material',
  Color = 'color',
  MaterialCombined = 'materialCombined',
  Gemstones = 'gemstones',
  MixedStones = 'mixedStones',
  GemstonesMixedStones = 'gemstonesMixedStones',
  Packing = 'packing',
}

const JewellerySets: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const tr = useTranslations();

  const [combinedMaterialVisible, setCombineMaterialVisible] = useState(!!productData.attributes.materialCombined);
  const [mixedStonesVisible, setMixedStonesVisible] = useState(!!productData.attributes.gemstonesMixedStones);

  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(JewellerySetsDtoValidator);

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
    register(Field.Color);
    register(Field.MaterialCombined);
    register(Field.Gemstones);
    register(Field.GemstonesMixedStones);
    register(Field.Packing);
  }, []);

  useEffect(() => {
    if (Object.keys(productData.attributes).length > 0) {
      setValue(Field.Necklace, productData.attributes.necklace);
      setValue(Field.Earrings, productData.attributes.earrings);
      setValue(Field.Brooch, productData.attributes.brooch);
      setValue(Field.Bracelet, productData.attributes.bracelet);
      setValue(Field.Diadem, productData.attributes.diadem);
      setValue(Field.Ring, productData.attributes.ring);
      setValue(Field.Pendant, productData.attributes.pendant);
      setValue(Field.Size, productData.attributes.size);
      setValue(Field.Material, productData.attributes.material);
      setValue(Field.Color, productData.attributes.color);
      setValue(Field.MaterialCombined, productData.attributes.materialCombined);
      setValue(Field.Gemstones, productData.attributes.gemstones);
      setValue(Field.MixedStones, productData.attributes.mixedStones);
      setValue(Field.GemstonesMixedStones, productData.attributes.gemstonesMixedStones);
      setValue(Field.Packing, productData.attributes.packing);
    }
  }, [productData.attributes]);

  const handleData = () => {
    return;
  };

  return (
    <form ref={formRef} onSubmit={handleForm(handleData)} noValidate autoComplete="off">
      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Necklace')}>
        <input
          type="checkbox"
          {...register(Field.Necklace)}
          defaultChecked={productData.attributes?.necklace as boolean}
        />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Earrings')}>
        <input
          type="checkbox"
          {...register(Field.Earrings)}
          defaultChecked={productData.attributes?.earrings as boolean}
        />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Brooch')}>
        <input type="checkbox" {...register(Field.Brooch)} defaultChecked={productData.attributes?.brooch as boolean} />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Bracelet')}>
        <input
          type="checkbox"
          {...register(Field.Bracelet)}
          defaultChecked={productData.attributes?.bracelet as boolean}
        />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Diadem')}>
        <input type="checkbox" {...register(Field.Diadem)} defaultChecked={productData.attributes?.diadem as boolean} />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Pendant')}>
        <input
          type="checkbox"
          {...register(Field.Pendant)}
          defaultChecked={productData.attributes?.pendant as boolean}
        />
      </FormControl>

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

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.MaterialCombined')}>
        <input
          type="checkbox"
          checked={combinedMaterialVisible}
          onChange={() => setCombineMaterialVisible(!combinedMaterialVisible)}
        />
      </FormControl>

      {combinedMaterialVisible && (
        <Select
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.MaterialCombined')}
          defaultText={tr.get('manageProduct.Fields.Select')}
          error={errors(Field.MaterialCombined)}
          options={arrayForSelect(attributes.material)}
          onChange={({ value }) => {
            setValue(Field.MaterialCombined, value);
            trigger(Field.MaterialCombined);
          }}
          defaultValue={productData.attributes.materialCombined}
          isSuggestProduct={isFieldSuggested(Field.MaterialCombined, productData, isSuggestProduct)}
        />
      )}

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
          checked={mixedStonesVisible}
          onChange={() => setMixedStonesVisible(!mixedStonesVisible)}
        />
      </FormControl>

      {mixedStonesVisible && (
        <Select
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.GemstonesMixedStones')}
          defaultText={tr.get('manageProduct.Fields.Select')}
          error={errors(Field.GemstonesMixedStones)}
          options={arrayForSelect(attributes.gemstones)}
          onChange={({ value }) => {
            setValue(Field.GemstonesMixedStones, value);
            trigger(Field.GemstonesMixedStones);
          }}
          defaultValue={productData.attributes.gemstonesMixedStones}
          isSuggestProduct={isFieldSuggested(Field.GemstonesMixedStones, productData, isSuggestProduct)}
        />
      )}

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
export default JewellerySets;
