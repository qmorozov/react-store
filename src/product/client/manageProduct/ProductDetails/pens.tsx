import { FC, FormEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import Select from '../../../../layouts/shared/Select';
import { PensDtoValidator } from '../../../models/pens/pens.dto.validation';
import FormControl from '../../../../layouts/shared/FormControl';

enum Field {
  Size = 'size',
  BodyColor = 'bodyColor',
  BodyMaterial = 'bodyMaterial',
  CombinedMaterials = 'combined_materials',
  InkColor = 'inkColor',
  InkReplaceable = 'inkReplaceable',
  Engraving = 'engraving',
  Vintage = 'vintage',
  Rare = 'rare',
  AwardCommemorative = 'awardCommemorative',
  ComesWithPacking = 'comesWithPacking',
  OriginalCase = 'originalCase',
  Tags = 'tags',
  Type = 'type',
}

const Pens: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const tr = useTranslations();

  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(PensDtoValidator);

  const formRef = useRef<HTMLFormElement>(null);

  const [combinedMaterials, setCombinedMaterials] = useState<boolean>(!!productData.attributes?.combined_materials);

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
    register(Field.BodyColor);
    register(Field.BodyMaterial);
    register(Field.InkColor);
    register(Field.Type);
    register(Field.CombinedMaterials);
  }, []);

  useEffect(() => {
    if (Object.keys(productData.attributes).length > 0) {
      setValue(Field.Size, productData.attributes.size);
      setValue(Field.BodyColor, productData.attributes.bodyColor);
      setValue(Field.BodyMaterial, productData.attributes.bodyMaterial);
      setValue(Field.InkColor, productData.attributes.inkColor);
      setValue(Field.InkReplaceable, productData.attributes.inkReplaceable);
      setValue(Field.Engraving, productData.attributes.engraving);
      setValue(Field.Vintage, productData.attributes.vintage);
      setValue(Field.Rare, productData.attributes.rare);
      setValue(Field.CombinedMaterials, productData.attributes.combined_materials);
      setValue(Field.AwardCommemorative, productData.attributes.awardCommemorative);
      setValue(Field.ComesWithPacking, productData.attributes.comesWithPacking);
      setValue(Field.OriginalCase, productData.attributes.originalCase);
      setValue(Field.Tags, productData.attributes.tags);
      setValue(Field.Type, productData.attributes.type);
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
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.BodyColor')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.BodyColor)}
        options={arrayForSelect(attributes.bodyColor)}
        onChange={({ value }) => {
          setValue(Field.BodyColor, value);
          trigger(Field.BodyColor);
        }}
        defaultValue={productData.attributes.bodyColor}
        isSuggestProduct={isFieldSuggested(Field.BodyColor, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.BodyMaterial')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.BodyMaterial)}
        options={arrayForSelect(attributes.bodyMaterial)}
        onChange={({ value }) => {
          setValue(Field.BodyMaterial, value);
          trigger(Field.BodyMaterial);
        }}
        defaultValue={productData.attributes.bodyMaterial}
        isSuggestProduct={isFieldSuggested(Field.BodyMaterial, productData, isSuggestProduct)}
      />

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.CombinedMaterials')}>
        <input type="checkbox" checked={combinedMaterials} onChange={() => setCombinedMaterials(!combinedMaterials)} />
      </FormControl>

      {combinedMaterials && (
        <Select
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.CombinedMaterials')}
          defaultText={tr.get('manageProduct.Fields.Select')}
          error={errors(Field.CombinedMaterials)}
          options={arrayForSelect(attributes.bodyMaterial)}
          onChange={({ value }) => {
            setValue(Field.CombinedMaterials, value || '');
            trigger(Field.CombinedMaterials);
          }}
          defaultValue={productData.attributes.combined_materials}
          isSuggestProduct={isFieldSuggested(Field.CombinedMaterials, productData, isSuggestProduct)}
        />
      )}

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.inkColor')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.InkColor)}
        options={arrayForSelect(attributes.inkColor)}
        onChange={({ value }) => {
          setValue(Field.InkColor, value);
          trigger(Field.InkColor);
        }}
        defaultValue={productData.attributes.inkColor}
        isSuggestProduct={isFieldSuggested(Field.InkColor, productData, isSuggestProduct)}
      />

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.inkReplaceable')}>
        <input
          type="checkbox"
          {...register(Field.InkReplaceable)}
          defaultChecked={productData.attributes?.inkReplaceable as boolean}
        />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.engraving')}>
        <input
          type="checkbox"
          {...register(Field.Engraving)}
          defaultChecked={productData.attributes?.engraving as boolean}
        />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.vintage')}>
        <input
          type="checkbox"
          {...register(Field.Vintage)}
          defaultChecked={productData.attributes?.vintage as boolean}
        />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.rare')}>
        <input type="checkbox" {...register(Field.Rare)} defaultChecked={productData.attributes?.rare as boolean} />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.awardCommemorative')}>
        <input
          type="checkbox"
          {...register(Field.AwardCommemorative)}
          defaultChecked={productData.attributes?.awardCommemorative as boolean}
        />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.comesWithPacking')}>
        <input
          type="checkbox"
          {...register(Field.ComesWithPacking)}
          defaultChecked={productData.attributes?.comesWithPacking as boolean}
        />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.originalCase')}>
        <input
          type="checkbox"
          {...register(Field.OriginalCase)}
          defaultChecked={productData.attributes?.originalCase as boolean}
        />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.tags')}>
        <input type="checkbox" {...register(Field.Tags)} defaultChecked={productData.attributes?.tags as boolean} />
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
    </form>
  );
});
export default Pens;
