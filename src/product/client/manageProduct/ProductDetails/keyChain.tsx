import { FC, FormEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import Select from '../../../../layouts/shared/Select';
import { KeyChainDtoValidator } from '../../../models/key-chain/key-chain.dto.validation';
import FormControl from '../../../../layouts/shared/FormControl';

enum Field {
  Size = 'size',
  Shape = 'shape',
  Material = 'material',
  Color = 'color',
  Gemstones = 'gemstones',
  Engraving = 'engraving',
  Packing = 'packing',
}

const KeyChain: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const tr = useTranslations();

  const [gemstonesVisible, setGemstonesVisible] = useState<boolean>(!!productData.attributes?.gemstones);

  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(KeyChainDtoValidator);

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
    register(Field.Shape);
    register(Field.Material);
    register(Field.Color);
    register(Field.Packing);
  }, []);

  useEffect(() => {
    if (Object.keys(productData.attributes).length > 0) {
      setValue(Field.Size, productData.attributes.size);
      setValue(Field.Shape, productData.attributes.shape);
      setValue(Field.Material, productData.attributes.material);
      setValue(Field.Color, productData.attributes.color);
      setValue(Field.Gemstones, productData.attributes.gemstones);
      setValue(Field.Engraving, productData.attributes.engraving);
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

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Gemstones')}>
        <input type="checkbox" checked={gemstonesVisible} onChange={() => setGemstonesVisible(!gemstonesVisible)} />
      </FormControl>

      {gemstonesVisible && (
        <Select
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Gemstones')}
          defaultText={tr.get('manageProduct.Fields.Select')}
          error={errors(Field.Gemstones)}
          options={arrayForSelect(attributes.gemstones)}
          onChange={({ value }) => {
            setValue(Field.Gemstones, value || '');
            trigger(Field.Gemstones);
          }}
          defaultValue={productData.attributes.gemstones}
          isSuggestProduct={isFieldSuggested(Field.Gemstones, productData, isSuggestProduct)}
        />
      )}

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Engraving')}>
        <input
          type="checkbox"
          {...register(Field.Engraving)}
          defaultChecked={productData.attributes?.engraving as boolean}
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
export default KeyChain;
