import { FC, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import { CoinDtoValidator } from '../../../models/coin/coin.dto.validation';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import Select from '../../../../layouts/shared/Select';
import type { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';
import FormControl from '../../../../layouts/shared/FormControl';

enum Field {
  Par = 'par',
  State = 'state',
  Theme = 'theme',
  Origin = 'origin',
  Material = 'material',
  Circulation = 'circulation',
  Peculiarities = 'peculiarities',
  Denomination = 'denomination',
  Collection = 'collection',
  Certificate = 'certificate',
  Size = 'size',
  PackingMaterial = 'packingMaterial',
  PackingSize = 'packingSize',
  StateReward = 'stateReward',
  ComesWithPacking = 'comesWithPacking',
}

const Coin: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const tr = useTranslations();

  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(CoinDtoValidator);

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
    register(Field.Par);
    register(Field.State);
    register(Field.Theme);
    register(Field.Origin);
    register(Field.Material);
    register(Field.Circulation);
    register(Field.Peculiarities);
    register(Field.Denomination);
    register(Field.Collection);
    register(Field.Certificate);
    register(Field.Size);
    register(Field.PackingMaterial);
    register(Field.PackingSize);
  }, []);

  useEffect(() => {
    if (productData.attributes) {
      setValue(Field.Par, productData.attributes.par);
      setValue(Field.State, productData.attributes.state);
      setValue(Field.Theme, productData.attributes.theme);
      setValue(Field.Origin, productData.attributes.origin);
      setValue(Field.Material, productData.attributes.material);
      setValue(Field.Circulation, productData.attributes.circulation);
      setValue(Field.Peculiarities, productData.attributes.peculiarities);
      setValue(Field.Denomination, productData.attributes.denomination);
      setValue(Field.Collection, productData.attributes.collection);
      setValue(Field.Certificate, productData.attributes.certificate);
      setValue(Field.Size, productData.attributes.size);
      setValue(Field.PackingMaterial, productData.attributes.packingMaterial);
      setValue(Field.PackingSize, productData.attributes.packingSize);
      setValue(Field.StateReward, productData.attributes.stateReward);
      setValue(Field.ComesWithPacking, productData.attributes.comesWithPacking);
    }
  }, [productData.attributes]);

  const handleData = () => {
    return;
  };

  return (
    <form ref={formRef} onSubmit={handleForm(handleData)} noValidate autoComplete="off">
      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Circulation')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Circulation)}
        options={arrayForSelect(attributes.circulation)}
        onChange={({ value }) => {
          setValue(Field.Circulation, value);
          trigger(Field.Circulation);
        }}
        defaultValue={productData.attributes?.circulation}
        isSuggestProduct={isFieldSuggested(Field.Circulation, productData, isSuggestProduct)}
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
        defaultValue={productData.attributes?.material}
        isSuggestProduct={isFieldSuggested(Field.Material, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Origin')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Origin)}
        options={arrayForSelect(attributes.origin)}
        onChange={({ value }) => {
          setValue(Field.Origin, value);
          trigger(Field.Origin);
        }}
        defaultValue={productData.attributes?.origin}
        isSuggestProduct={isFieldSuggested(Field.Origin, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Par')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Par)}
        options={arrayForSelect(attributes.par)}
        onChange={({ value }) => {
          setValue(Field.Par, value);
          trigger(Field.Par);
        }}
        defaultValue={productData.attributes?.par}
        isSuggestProduct={isFieldSuggested(Field.Par, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Peculiarities')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Peculiarities)}
        options={arrayForSelect(attributes.peculiarities)}
        onChange={({ value }) => {
          setValue(Field.Peculiarities, value);
          trigger(Field.Peculiarities);
        }}
        defaultValue={productData.attributes?.peculiarities}
        isSuggestProduct={isFieldSuggested(Field.Peculiarities, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.State')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.State)}
        options={arrayForSelect(attributes.state)}
        onChange={({ value }) => {
          setValue(Field.State, value);
          trigger(Field.State);
        }}
        defaultValue={productData.attributes?.state}
        isSuggestProduct={isFieldSuggested(Field.State, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Theme')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Theme)}
        options={arrayForSelect(attributes.theme)}
        onChange={({ value }) => {
          setValue(Field.Theme, value);
          trigger(Field.Theme);
        }}
        defaultValue={productData.attributes?.theme}
        isSuggestProduct={isFieldSuggested(Field.Theme, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Denomination')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Denomination)}
        options={arrayForSelect(attributes.denomination)}
        onChange={({ value }) => {
          setValue(Field.Denomination, value);
          trigger(Field.Denomination);
        }}
        defaultValue={productData.attributes?.denomination}
        isSuggestProduct={isFieldSuggested(Field.Denomination, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Collection')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Collection)}
        options={arrayForSelect(attributes.collection)}
        onChange={({ value }) => {
          setValue(Field.Collection, value);
          trigger(Field.Collection);
        }}
        defaultValue={productData.attributes?.collection}
        isSuggestProduct={isFieldSuggested(Field.Collection, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Certificate')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Certificate)}
        options={arrayForSelect(attributes.certificate)}
        onChange={({ value }) => {
          setValue(Field.Certificate, value);
          trigger(Field.Certificate);
        }}
        defaultValue={productData.attributes?.certificate}
        isSuggestProduct={isFieldSuggested(Field.Certificate, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Size')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Size)}
        options={arrayForSelect(attributes.size)}
        onChange={({ value }) => {
          setValue(Field.Size, value);
          trigger(Field.Size);
        }}
        defaultValue={productData.attributes?.size}
        isSuggestProduct={isFieldSuggested(Field.Size, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.PackingMaterial')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.PackingMaterial)}
        options={arrayForSelect(attributes.packingMaterial)}
        onChange={({ value }) => {
          setValue(Field.PackingMaterial, value);
          trigger(Field.PackingMaterial);
        }}
        defaultValue={productData.attributes?.packingMaterial}
        isSuggestProduct={isFieldSuggested(Field.PackingMaterial, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.PackingSize')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.PackingSize)}
        options={arrayForSelect(attributes.packingSize)}
        onChange={({ value }) => {
          setValue(Field.PackingSize, value);
          trigger(Field.PackingSize);
        }}
        defaultValue={productData.attributes?.packingSize}
        isSuggestProduct={isFieldSuggested(Field.PackingSize, productData, isSuggestProduct)}
      />

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.stateReward')}>
        <input
          type="checkbox"
          {...register(Field.StateReward)}
          defaultChecked={productData.attributes?.stateReward as boolean}
        />
      </FormControl>

      <FormControl type="checkbox" placeholder={tr.get('manageProduct.Fields.SpecificAttributes.comesWithPacking')}>
        <input
          type="checkbox"
          {...register(Field.ComesWithPacking)}
          defaultChecked={productData.attributes?.comesWithPacking as boolean}
        />
      </FormControl>
    </form>
  );
});

export default Coin;
