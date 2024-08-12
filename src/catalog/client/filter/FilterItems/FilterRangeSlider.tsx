import { ChangeEvent, FC, useEffect, useState } from 'react';
import { iFilterMetadata } from '../../../models/filter/filter.abstract';
import { useTranslations } from '../../../../translation/translation.context';
import RangeSlider, { IRangeSlider } from './RangeSlider';
import { FilterMultiSelect, FilterRange } from '../../../models/filter/filter.type';

interface IFilterRangeSlider {
  filterMetadata: iFilterMetadata;
}

const FilterRangeSlider: FC<IFilterRangeSlider> = ({ filterMetadata }) => {
  const tr = useTranslations();
  const { filter } = filterMetadata;

  const [minValue, setMinValue] = useState<number>(filter.selectedMin);
  const [maxValue, setMaxValue] = useState<number>(filter.selectedMax);

  const [rangeSliderData, setRangeSliderData] = useState<IRangeSlider['data']>(null);
  const [inputVisible, setInputVisible] = useState<boolean>(true);
  const [indexData, setIndexData] = useState<[number, number]>();

  useEffect(() => {
    switch (filter?.constructor) {
      case FilterRange:
        setInputVisible(true);
        setRangeSliderData({
          min: filter.min,
          max: filter.max,
        });
        break;

      case FilterMultiSelect:
        setInputVisible(false);
        setRangeSliderData(filter.list);
        break;

      default:
        break;
    }
  }, [filterMetadata]);

  useEffect(() => {
    switch (filter?.constructor) {
      case FilterRange:
        filter.selectedMin = minValue;
        filter.selectedMax = maxValue;
        break;

      case FilterMultiSelect:
        if (minValue !== undefined && maxValue !== undefined) {
          const selectedObjects = filter.list.slice(minValue, maxValue + 1);
          selectedObjects.forEach(({ id }) => {
            filterMetadata.filter.selected[id] = true;
          });

          filter.list.forEach(({ id }, index) => {
            if (index < minValue || index > maxValue) {
              filterMetadata.filter.selected[id] = false;
            }
          });
        }
        break;

      default:
        break;
    }
  }, [minValue, maxValue]);

  useEffect(() => {
    switch (filter?.constructor) {
      case FilterMultiSelect:
        const selectedIndexes = (filter.list || []).reduce((acc, item, index) => {
          if (filter.selected?.[item?.id]) {
            acc.push(index);
          }
          return acc;
        }, []);

        if (filter?.selected && Object.keys(filter?.selected)?.length > 0) {
          setIndexData([Math.min(...selectedIndexes), Math.max(...selectedIndexes)]);
        }
        break;

      default:
        break;
    }
  }, [filter]);

  return (
    <fieldset className="filter filter__item">
      <span className="filter__item-title">{tr.get(filterMetadata.title)}:</span>
      {inputVisible && (
        <>
          <input
            type="number"
            min={filter.min}
            max={filter.max}
            value={minValue}
            className="filter__item-input"
            placeholder={tr.get('common.From')}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setMinValue(Number(event.target.value))}
          />

          <input
            type="number"
            min={filter.min}
            max={filter.max}
            value={maxValue}
            className="filter__item-input"
            placeholder={tr.get('common.To')}
            onChange={(event: ChangeEvent<HTMLInputElement>) => setMaxValue(Number(event.target.value))}
          />
        </>
      )}
      {rangeSliderData && (
        <RangeSlider
          data={rangeSliderData}
          onValuesChange={(value) => {
            setMinValue(value[0]);
            setMaxValue(value[1]);
          }}
          defaultValue={
            filterMetadata.filter.max
              ? [filterMetadata.filter.selectedMin, filterMetadata.filter.selectedMax]
              : indexData
          }
        />
      )}
    </fieldset>
  );
};

export default FilterRangeSlider;
