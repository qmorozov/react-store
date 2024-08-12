import { FC, FormEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import Select from '../../../../layouts/shared/Select';
import { CufflinksDtoValidator } from '../../../models/cufflinks/cufflinks.dto.validation';
import FormControl from '../../../../layouts/shared/FormControl';

enum Field {
  Size = 'size',
  Material = 'material',
  Color = 'color',
  Gemstone = 'gemstone',
  GemstoneType = 'gemstoneType',
  CufflinkQuantity = 'cufflinkQuantity',
  Engraving = 'engraving',
  Shape = 'shape',
  Textured = 'textured',
  Type = 'type',
  Packing = 'packing',
  CombinedMaterials = 'combined_materials',
}

const Cufflinks: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const tr = useTranslations();

  const [gemstonesVisible, setGemstonesVisible] = useState<boolean>(!!productData.attributes?.gemstoneType);
  const [combinedMaterials, setCombinedMaterials] = useState<boolean>(!!productData.attributes?.combined_materials);

  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(CufflinksDtoValidator);

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
    register(Field.Material);
    register(Field.Color);
    register(Field.GemstoneType);
    register(Field.CufflinkQuantity);
    register(Field.Shape);
    register(Field.Type);
    register(Field.Packing);
    register(Field.CombinedMaterials);
  }, []);

  useEffect(() => {
    if (Object.keys(productData.attributes).length > 0) {
      setValue(Field.Size, productData.attributes.size);
      setValue(Field.Material, productData.attributes.material);
      setValue(Field.Color, productData.attributes.color);
      setValue(Field.Gemstone, productData.attributes.gemstone);
      setValue(Field.GemstoneType, productData.attributes.gemstoneType);
      setValue(Field.CufflinkQuantity, productData.attributes.cufflinkQuantity);
      setValue(Field.Engraving, productData.attributes.engraving);
      setValue(Field.Shape, productData.attributes.shape);
      setValue(Field.Textured, productData.attributes.textured);
      setValue(Field.CombinedMaterials, productData.attributes.combined_materials);
      setValue(Field.Type, productData.attributes.type);
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
        inputPlaceholder="mm"
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

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.CufflinkQuantity')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.CufflinkQuantity)}
        options={arrayForSelect(attributes.cufflinkQuantity)}
        onChange={({ value }) => {
          setValue(Field.CufflinkQuantity, value);
          trigger(Field.CufflinkQuantity);
        }}
        defaultValue={productData.attributes.cufflinkQuantity}
        isSuggestProduct={isFieldSuggested(Field.CufflinkQuantity, productData, isSuggestProduct)}
      />

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Engraving')}>
        <input
          type="checkbox"
          {...register(Field.Engraving)}
          defaultChecked={productData.attributes?.engraving as boolean}
        />
      </FormControl>

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Shape')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Shape)}
        options={arrayForSelect(attributes.shape)}
        onChange={({ value }) => {
          setValue(Field.Shape, value);
          trigger(Field.Shape);
        }}
        defaultValue={productData.attributes.shape}
        isSuggestProduct={isFieldSuggested(Field.Shape, productData, isSuggestProduct)}
      />

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Textured')}>
        <input
          type="checkbox"
          {...register(Field.Textured)}
          defaultChecked={productData.attributes?.textured as boolean}
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
export default Cufflinks;
