import { FC, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export interface ISliderDataItem {
  value: number;
  name: string;
}

export interface IRangeSlider {
  onValuesChange?: (values: [number, number]) => void;
  data: ISliderDataItem[] | { min: number; max: number };
  defaultValue?: [number, number];
}

const RangeSlider: FC<IRangeSlider> = ({ data, onValuesChange, defaultValue }) => {
  const dataType = Array.isArray(data) ? 'text' : 'number';

  const rangeData = (
    Array.isArray(data)
      ? {
          min: 0,
          max: data.length - 1,
        }
      : data
  ) as { min: number; max: number };

  const [sliderIndexes, setSliderIndexes] = useState<[number, number]>(
    defaultValue ? defaultValue : [rangeData.min, rangeData.max],
  );

  const handleSliderChange = (indexes: [number, number]): void => {
    setSliderIndexes(indexes);
    return onValuesChange?.(indexes);
  };

  const getMarks = (): { [key: number]: string | number } => {
    if (dataType === 'text') {
      return (data as ISliderDataItem[]).reduce((acc, val, index) => {
        return { ...acc, [index]: val.name };
      }, {});
    }

    if (dataType === 'number') {
      return {
        [rangeData.min]: rangeData.min,
        [rangeData.max]: rangeData.max,
      };
    }

    return {};
  };

  const marks: { [key: number]: string | number } = getMarks();

  return (
    <div className="range-slider-wrapper">
      <Slider
        range
        draggableTrack
        marks={marks}
        min={rangeData.min}
        max={rangeData.max}
        value={sliderIndexes}
        className="range-slider"
        onChange={handleSliderChange}
      />
    </div>
  );
};

export default RangeSlider;
