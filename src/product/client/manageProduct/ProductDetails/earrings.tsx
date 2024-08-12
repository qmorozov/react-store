import { FC, FormEvent, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import Select from '../../../../layouts/shared/Select';
import { EarringsDtoValidator } from '../../../models/earrings/earrings.dto.validation';
import FormControl from '../../../../layouts/shared/FormControl';
import { GeneralField } from '../../../models/ProductType.enum';

enum Field {
  Type = 'type',
  Material = 'material',
  Color = 'color',
  Gem = 'gem',
  Vintage = 'vintage',
  Size = 'size',
  ProofOfOrigin = 'proofOfOrigin',
  OriginalCase = 'originalCase',
  CardOrCertificate = 'cardOrCertificate',
}

const Earrings: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const tr = useTranslations();

  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(EarringsDtoValidator);

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
    register(Field.Material);
    register(Field.Color);
    register(Field.Gem);
    register(Field.Vintage);
  }, []);

  useEffect(() => {
    if (Object.keys(productData.attributes).length > 0) {
      setValue(Field.Size, productData.attributes.size);
      setValue(Field.Type, productData.attributes.type);
      setValue(Field.Material, productData.attributes.material);
      setValue(Field.Color, productData.attributes.color);
      setValue(Field.Gem, productData.attributes.gem);
      setValue(Field.Vintage, productData.attributes.vintage);
      setValue(Field.CardOrCertificate, productData.attributes.cardOrCertificate);
      setValue(Field.OriginalCase, productData.attributes.originalCase);
      setValue(Field.ProofOfOrigin, productData.attributes.proofOfOrigin);
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
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Gem')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Gem)}
        options={arrayForSelect(attributes.gem)}
        onChange={({ value }) => {
          setValue(Field.Gem, value);
          trigger(Field.Gem);
        }}
        defaultValue={productData.attributes.gem}
        isSuggestProduct={isFieldSuggested(Field.Gem, productData, isSuggestProduct)}
      />

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.vintage')}>
        <input
          type="checkbox"
          {...register(Field.Vintage)}
          defaultChecked={productData.attributes?.vintage as boolean}
        />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.proofOfOrigin')}>
        <input
          type="checkbox"
          {...register(Field.ProofOfOrigin)}
          defaultChecked={productData.attributes?.proofOfOrigin as boolean}
        />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.originalCase')}>
        <input
          type="checkbox"
          {...register(Field.OriginalCase)}
          defaultChecked={productData.attributes?.originalCase as boolean}
        />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.cardOrCertificate')}>
        <input
          type="checkbox"
          {...register(Field.CardOrCertificate)}
          defaultChecked={productData.attributes?.cardOrCertificate as boolean}
        />
      </FormControl>
    </form>
  );
});
export default Earrings;
