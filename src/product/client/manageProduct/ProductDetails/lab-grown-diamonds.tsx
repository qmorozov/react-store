import { FC, forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { IDetailsItem } from '../Tabs/Details';
import { useTranslations } from '../../../../translation/translation.context';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import FormControl from '../../../../layouts/shared/FormControl';
import { arrayForSelect, isFieldSuggested } from '../../manageProduct.client';
import Select from '../../../../layouts/shared/Select';
import { LabGrownDiamondsDtoValidator } from '../../../models/lab-grown-diamonds/lab-grown-diamonds.dto.validation';

enum Field {
  Cut = 'cut',
  CutScore = 'cutScore',
  Depth = 'depth',
  Kind = 'kind',
  Fluorescence = 'fluorescence',
  LwRatio = 'lwRatio',
  Table = 'table',
  Shape = 'shape',
  Carat = 'carat',
  Clarity = 'clarity',
  ColorGrade = 'colorGrade',
}

const LabGrownDiamonds: FC<IDetailsItem> = forwardRef(
  ({ attributes, setDetails, isSuggestProduct, productData }, ref) => {
    const tr = useTranslations();

    const {
      register,
      setValue,
      errors,
      trigger,
      getValues,
      handleSubmit: handleForm,
    } = useFormValidation(LabGrownDiamondsDtoValidator);

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
      register(Field.Clarity);
      register(Field.ColorGrade);
      register(Field.Cut);
      register(Field.Kind);
      register(Field.Fluorescence);
    }, []);

    useEffect(() => {
      if (Object.keys(productData.attributes).length > 0) {
        setValue(Field.Cut, productData.attributes.cut);
        setValue(Field.Kind, productData.attributes.kind);
        setValue(Field.Shape, productData.attributes.shape);
        setValue(Field.Carat, productData.attributes.carat);
        setValue(Field.Clarity, productData.attributes.clarity);
        setValue(Field.ColorGrade, productData.attributes.colorGrade);
        setValue(Field.CutScore, productData.attributes.cutScore);
        setValue(Field.Depth, productData.attributes.depth);
        setValue(Field.Fluorescence, productData.attributes.fluorescence);
        setValue(Field.LwRatio, productData.attributes.lwRatio);
        setValue(Field.Table, productData.attributes.table);
      }
    }, [productData.attributes]);

    const handleData = () => {
      return;
    };

    return (
      <form ref={formRef} onSubmit={handleForm(handleData)} noValidate autoComplete="off">
        <FormControl
          type="number"
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Carat')}
          error={errors(Field.Carat)}
          isSuggestProduct={isFieldSuggested(Field.Carat, productData, isSuggestProduct)}
          translateParameters={{ min: attributes.carat.min, max: attributes.carat.max }}
        >
          <input
            type="number"
            {...register(Field.Carat, {
              onChange: () => {
                trigger(Field.Carat);
              },
            })}
            max={attributes.carat.max}
            min={attributes.carat.min}
            autoFocus={productData.attributes.carat === ''}
          />
        </FormControl>

        <Select
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Shape')}
          defaultText={tr.get('manageProduct.Fields.Select')}
          error={errors(Field.Shape)}
          options={arrayForSelect(attributes.shape)}
          defaultValue={productData.attributes?.shape}
          onChange={({ value }) => {
            setValue(Field.Shape, value);
            trigger(Field.Shape);
          }}
          isSuggestProduct={isFieldSuggested(Field.Shape, productData, isSuggestProduct)}
        />

        <Select
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Clarity')}
          defaultText={tr.get('manageProduct.Fields.Select')}
          error={errors(Field.Clarity)}
          options={arrayForSelect(attributes.clarity)}
          defaultValue={productData.attributes?.clarity}
          onChange={({ value }) => {
            setValue(Field.Clarity, value);
            trigger(Field.Clarity);
          }}
          isSuggestProduct={isFieldSuggested(Field.Clarity, productData, isSuggestProduct)}
        />

        <Select
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.ColorGrade')}
          defaultText={tr.get('manageProduct.Fields.Select')}
          error={errors(Field.ColorGrade)}
          options={arrayForSelect(attributes.colorGrade)}
          defaultValue={productData.attributes?.colorGrade}
          onChange={({ value }) => {
            setValue(Field.ColorGrade, value);
            trigger(Field.ColorGrade);
          }}
          isSuggestProduct={isFieldSuggested(Field.ColorGrade, productData, isSuggestProduct)}
        />

        <Select
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Cut')}
          defaultText={tr.get('manageProduct.Fields.Select')}
          error={errors(Field.Cut)}
          options={arrayForSelect(attributes.cut)}
          defaultValue={productData.attributes?.cut}
          onChange={({ value }) => {
            setValue(Field.Cut, value);
            trigger(Field.Cut);
          }}
          isSuggestProduct={isFieldSuggested(Field.Cut, productData, isSuggestProduct)}
        />

        <Select
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Kind')}
          defaultText={tr.get('manageProduct.Fields.Select')}
          error={errors(Field.Kind)}
          options={arrayForSelect(attributes.kind)}
          defaultValue={productData.attributes?.kind}
          onChange={({ value }) => {
            setValue(Field.Kind, value);
            trigger(Field.Kind);
          }}
          isSuggestProduct={isFieldSuggested(Field.Kind, productData, isSuggestProduct)}
        />

        <FormControl
          type="number"
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.CutScore')}
          error={errors(Field.CutScore)}
          isSuggestProduct={isFieldSuggested(Field.CutScore, productData, isSuggestProduct)}
          translateParameters={{ min: attributes.cutScore.min, max: attributes.cutScore.max }}
        >
          <input
            type="number"
            {...register(Field.CutScore, {
              onChange: () => {
                trigger(Field.CutScore);
              },
            })}
            max={attributes.cutScore.max}
            min={attributes.cutScore.min}
            autoFocus={productData.attributes.cutScore === ''}
          />
        </FormControl>

        <FormControl
          type="number"
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Depth')}
          error={errors(Field.Depth)}
          isSuggestProduct={isFieldSuggested(Field.Depth, productData, isSuggestProduct)}
          translateParameters={{ min: attributes.depth.min, max: attributes.depth.max }}
        >
          <input
            type="number"
            {...register(Field.Depth, {
              onChange: () => {
                trigger(Field.Depth);
              },
            })}
            max={attributes.depth.max}
            min={attributes.depth.min}
            autoFocus={productData.attributes.depth === ''}
          />
        </FormControl>

        <Select
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Fluorescence')}
          defaultText={tr.get('manageProduct.Fields.Select')}
          error={errors(Field.Fluorescence)}
          options={arrayForSelect(attributes.fluorescence)}
          defaultValue={productData.attributes?.fluorescence}
          onChange={({ value }) => {
            setValue(Field.Fluorescence, value);
            trigger(Field.Fluorescence);
          }}
          isSuggestProduct={isFieldSuggested(Field.Fluorescence, productData, isSuggestProduct)}
        />

        <FormControl
          type="number"
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.LwRatio')}
          error={errors(Field.LwRatio)}
          isSuggestProduct={isFieldSuggested(Field.LwRatio, productData, isSuggestProduct)}
          translateParameters={{ min: attributes.lwRatio.min, max: attributes.lwRatio.max }}
        >
          <input
            type="number"
            {...register(Field.LwRatio, {
              onChange: () => {
                trigger(Field.LwRatio);
              },
            })}
            max={attributes.lwRatio.max}
            min={attributes.lwRatio.min}
            autoFocus={productData.attributes.lwRatio === ''}
          />
        </FormControl>

        <FormControl
          type="number"
          placeholder={tr.get('manageProduct.Fields.SpecificAttributes.Table')}
          error={errors(Field.Table)}
          isSuggestProduct={isFieldSuggested(Field.Table, productData, isSuggestProduct)}
          translateParameters={{ min: attributes.table.min, max: attributes.table.max }}
        >
          <input
            type="number"
            {...register(Field.Table, {
              onChange: () => {
                trigger(Field.Table);
              },
            })}
            max={attributes.table.max}
            min={attributes.table.min}
            autoFocus={productData.attributes.table === ''}
          />
        </FormControl>
      </form>
    );
  },
);

export default LabGrownDiamonds;
