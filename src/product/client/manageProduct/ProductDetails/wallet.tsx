import { FC, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import { WalletDtoValidator } from '../../../models/wallet/wallet.dto.validation';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import Select from '../../../../layouts/shared/Select';
import type { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';

enum Field {
  Clasp = 'clasp',
  Color = 'color',
  Material = 'material',
  NumberOfCompartmentsForBills = 'number_of_compartments_for_bills',
  NumberOfCompartmentsForCards = 'number_of_compartments_for_cards',
}

const Wallet: FC<IDetailsItem> = forwardRef(({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
  const tr = useTranslations();

  const {
    register,
    setValue,
    errors,
    trigger,
    getValues,
    handleSubmit: handleForm,
  } = useFormValidation(WalletDtoValidator);

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
    register(Field.Clasp);
    register(Field.Color);
    register(Field.Material);
    register(Field.NumberOfCompartmentsForCards);
    register(Field.NumberOfCompartmentsForBills);
  }, []);

  useEffect(() => {
    if (productData.attributes) {
      setValue(Field.Color, productData.attributes.color);
      setValue(Field.Clasp, productData.attributes.clasp);
      setValue(Field.Material, productData.attributes.material);
      setValue(Field.NumberOfCompartmentsForCards, productData.attributes.number_of_compartments_for_cards);
      setValue(Field.NumberOfCompartmentsForBills, productData.attributes.number_of_compartments_for_bills);
    }
  }, [productData.attributes]);

  const handleData = () => {
    return;
  };

  return (
    <form ref={formRef} onSubmit={handleForm(handleData)} noValidate autoComplete="off">
      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Clasp')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.Clasp)}
        options={arrayForSelect(attributes.clasp)}
        onChange={({ value }) => {
          setValue(Field.Clasp, value);
          trigger(Field.Clasp);
        }}
        defaultValue={productData.attributes?.clasp}
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
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.NumberOfCompartmentsForCards')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.NumberOfCompartmentsForCards)}
        options={arrayForSelect(attributes.number_of_compartments_for_cards)}
        defaultValue={productData.attributes?.number_of_compartments_for_cards}
        onChange={({ value }) => {
          setValue(Field.NumberOfCompartmentsForCards, value);
          trigger(Field.NumberOfCompartmentsForCards);
        }}
        isSuggestProduct={isFieldSuggested(Field.NumberOfCompartmentsForCards, productData, isSuggestProduct)}
      />

      <Select
        placeholder={tr.get('manageProduct.Fields.SpecificAttributes.NumberOfCompartmentsForBills')}
        defaultText={tr.get('manageProduct.Fields.Select')}
        error={errors(Field.NumberOfCompartmentsForBills)}
        options={arrayForSelect(attributes.number_of_compartments_for_bills)}
        defaultValue={productData.attributes?.number_of_compartments_for_bills}
        onChange={({ value }) => {
          setValue(Field.NumberOfCompartmentsForBills, value);
          trigger(Field.NumberOfCompartmentsForBills);
        }}
        isSuggestProduct={isFieldSuggested(Field.NumberOfCompartmentsForBills, productData, isSuggestProduct)}
      />
    </form>
  );
});

export default Wallet;
