import { FC, FormEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import { WatchDtoValidator } from '../../../models/watch/watch.dto.validation';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import type { IDetailsItem } from '../Tabs/Details';
import Select from '../../../../layouts/shared/Select';
import FormControl from '../../../../layouts/shared/FormControl';
import { useTranslations } from '../../../../translation/translation.context';

enum Field {
  Glass = 'glass',
  Version = 'version',
  Coating = 'coating',
  Material = 'material',
  BodyShape = 'body_shape',
  DialColor = 'dial_color',
  Width = 'width',
  Height = 'height',
  BodyMaterial = 'body_material',
  CombinedMaterials = 'combined_materials',
  ColorOfBody = 'color_of_body',
  MechanismType = 'mechanism_type',
  TypeOfIndication = 'type_of_indication',
  BraceletOrStrap = 'bracelet_or_strap',
  WaterProtection = 'water_protection',
}

const Watch: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(WatchDtoValidator);
  const tr = useTranslations();

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
    register(Field.Glass);
    register(Field.Version);
    register(Field.Coating);
    register(Field.Material);
    register(Field.BodyShape);
    register(Field.DialColor);
    register(Field.ColorOfBody);
    register(Field.BodyMaterial);
    register(Field.CombinedMaterials);
    register(Field.MechanismType);
    register(Field.WaterProtection);
    register(Field.BraceletOrStrap);
    register(Field.TypeOfIndication);
  }, []);

  useEffect(() => {
    if (Object.keys(productData.attributes).length > 0) {
      setValue(Field.Glass, productData.attributes.glass);
      setValue(Field.Version, productData.attributes.version);
      setValue(Field.Coating, productData.attributes.coating);
      setValue(Field.Material, productData.attributes.material);
      setValue(Field.BodyShape, productData.attributes.body_shape);
      setValue(Field.DialColor, productData.attributes.dial_color);
      setValue(Field.ColorOfBody, productData.attributes.color_of_body);
      setValue(Field.Width, productData.attributes.width);
      setValue(Field.Height, productData.attributes.height);
      setValue(Field.BodyMaterial, productData.attributes.body_material);
      setValue(Field.CombinedMaterials, productData.attributes.combined_materials);
      setValue(Field.MechanismType, productData.attributes.mechanism_type);
      setValue(Field.WaterProtection, productData.attributes.water_protection);
      setValue(Field.BraceletOrStrap, productData.attributes.bracelet_or_strap);
      setValue(Field.TypeOfIndication, productData.attributes.type_of_indication);
    }
  }, [productData.attributes]);

  const handleData = () => {
    return;
  };

  return (
    <form ref={formRef} onSubmit={handleForm(handleData)} noValidate autoComplete="off">
      <div className="form-group__fields">
        <FormControl
          type="number"
          inputPlaceholder="mm"
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Width')}
          error={errors(Field.Width)}
          isSuggestProduct={isFieldSuggested(Field.Width, productData, isSuggestProduct)}
          translateParameters={{ min: attributes.width.min, max: attributes.width.max }}
        >
          <input
            type="number"
            {...register(Field.Width)}
            max={attributes.width.max}
            min={attributes.width.min}
            onInput={(event: FormEvent<HTMLInputElement>) => {
              setValue(Field.Width, (event.target as HTMLInputElement).value);
              trigger(Field.Width);
            }}
          />
        </FormControl>

        <FormControl
          type="number"
          inputPlaceholder="mm"
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Height')}
          error={errors(Field.Height)}
          isSuggestProduct={isFieldSuggested(Field.Height, productData, isSuggestProduct)}
          translateParameters={{ min: attributes.height.min, max: attributes.height.max }}
        >
          <input
            type="number"
            {...register(Field.Height)}
            max={attributes.height.max}
            min={attributes.height.min}
            onInput={(event: FormEvent<HTMLInputElement>) => {
              setValue(Field.Height, (event.target as HTMLInputElement).value);
              trigger(Field.Height);
            }}
          />
        </FormControl>
      </div>

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.BodyMaterial')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.BodyMaterial)}
        options={arrayForSelect(attributes.body_material)}
        onChange={({ value }) => {
          setValue(Field.BodyMaterial, value);
          trigger(Field.BodyMaterial);
        }}
        defaultValue={productData.attributes.body_material}
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
          options={arrayForSelect(attributes.body_material)}
          onChange={({ value }) => {
            setValue(Field.CombinedMaterials, value || '');
            trigger(Field.CombinedMaterials);
          }}
          defaultValue={productData.attributes.combined_materials}
          isSuggestProduct={isFieldSuggested(Field.CombinedMaterials, productData, isSuggestProduct)}
        />
      )}

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.BodyShape')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.BodyShape)}
        options={arrayForSelect(attributes.body_shape)}
        onChange={({ value }) => {
          setValue(Field.BodyShape, value);
          trigger(Field.BodyShape);
        }}
        defaultValue={productData.attributes.body_shape}
        isSuggestProduct={isFieldSuggested(Field.BodyShape, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.ColorOfBody')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.ColorOfBody)}
        options={arrayForSelect(attributes.color_of_body)}
        onChange={({ value }) => {
          setValue(Field.ColorOfBody, value);
          trigger(Field.ColorOfBody);
        }}
        defaultValue={productData.attributes.color_of_body}
        isSuggestProduct={isFieldSuggested(Field.ColorOfBody, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.BraceletOrStrap')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.BraceletOrStrap)}
        options={arrayForSelect(attributes.bracelet_or_strap)}
        onChange={({ value }) => {
          setValue(Field.BraceletOrStrap, value);
          trigger(Field.BraceletOrStrap);
        }}
        defaultValue={productData.attributes.bracelet_or_strap}
        isSuggestProduct={isFieldSuggested(Field.BraceletOrStrap, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.MaterialStrap/BraceletMaterial')}
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
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.DialColor')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.DialColor)}
        options={arrayForSelect(attributes.dial_color)}
        onChange={({ value }) => {
          setValue(Field.DialColor, value);
          trigger(Field.DialColor);
        }}
        defaultValue={productData.attributes.dial_color}
        isSuggestProduct={isFieldSuggested(Field.DialColor, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Glass')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Glass)}
        options={arrayForSelect(attributes.glass)}
        onChange={({ value }) => {
          setValue(Field.Glass, value);
          trigger(Field.Glass);
        }}
        defaultValue={productData.attributes.glass}
        isSuggestProduct={isFieldSuggested(Field.Glass, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.MechanismType')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.MechanismType)}
        options={arrayForSelect(attributes.mechanism_type)}
        onChange={({ value }) => {
          setValue(Field.MechanismType, value);
          trigger(Field.MechanismType);
        }}
        defaultValue={productData.attributes.mechanism_type}
        isSuggestProduct={isFieldSuggested(Field.MechanismType, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.TypeOfIndication')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.TypeOfIndication)}
        options={arrayForSelect(attributes.type_of_indication)}
        onChange={({ value }) => {
          setValue(Field.TypeOfIndication, value);
          trigger(Field.TypeOfIndication);
        }}
        defaultValue={productData.attributes.type_of_indication}
        isSuggestProduct={isFieldSuggested(Field.TypeOfIndication, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Version')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Version)}
        options={arrayForSelect(attributes.version)}
        onChange={({ value }) => {
          setValue(Field.Version, value);
          trigger(Field.Version);
        }}
        defaultValue={productData.attributes.version}
        isSuggestProduct={isFieldSuggested(Field.Version, productData, isSuggestProduct)}
      />

      <Select
        defaultText={tr.get('manageProduct.Fields.Select')}
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.WaterProtection')}
        error={errors(Field.WaterProtection)}
        options={arrayForSelect(attributes.water_protection)}
        onChange={({ value }) => {
          setValue(Field.WaterProtection, value);
          trigger(Field.WaterProtection);
        }}
        defaultValue={productData.attributes.water_protection}
        isSuggestProduct={isFieldSuggested(Field.WaterProtection, productData, isSuggestProduct)}
      />
    </form>
  );
});

export default Watch;
