import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useTranslations } from '../../../../translation/translation.context';
import { iFilterMetadata } from '../../../models/filter/filter.abstract';

interface IFilterItemRange {
  filterMetadata: iFilterMetadata;
}

const FilterItemRange: FC<IFilterItemRange> = ({ filterMetadata }) => {
  const tr = useTranslations();

  const { filter } = filterMetadata;
  const [minValue, setMinValue] = useState<number>(filter.selectedMin);
  const [maxValue, setMaxValue] = useState<number>(filter.selectedMax);
  const [debouncedMinValue, setDebouncedMinValue] = useState<number>(filter.selectedMin);
  const [debouncedMaxValue, setDebouncedMaxValue] = useState<number>(filter.selectedMax);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedMinValue(minValue);
      setDebouncedMaxValue(maxValue);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [minValue, maxValue]);

  useEffect(() => {
    filterMetadata.filter.selectedMin = debouncedMinValue;
    filterMetadata.filter.selectedMax = debouncedMaxValue;
  }, [debouncedMinValue, debouncedMaxValue]);

  return (
    <fieldset className={`filter filter__item --range ${filterMetadata.range ? '--range-slider' : ''}`}>
      <span className="filter__item-title">{tr.get(filterMetadata.title)}:</span>

      <input
        type="number"
        min={filter.min}
        max={filter.max}
        value={minValue}
        className="filter__item-input"
        placeholder={tr.get('common.From')}
        step={minValue.toString().includes('.') ? '0.1' : '1'}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setMinValue(Number(event.target.value))}
      />
      <input
        type="number"
        min={filter.min}
        max={filter.max}
        value={maxValue}
        className="filter__item-input"
        placeholder={tr.get('common.To')}
        step={minValue.toString().includes('.') ? '0.1' : '1'}
        onChange={(event: ChangeEvent<HTMLInputElement>) => setMaxValue(Number(event.target.value))}
      />
    </fieldset>
  );
};

export default FilterItemRange;
