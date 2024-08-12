import { FC, useContext, useEffect, useState } from 'react';
import { FilterMultiSelect, FilterRange, FilterSwitch } from '../../../models/filter/filter.type';
import { iFilterMetadata } from '../../../models/filter/filter.abstract';
import FilterContext from '../../filterContext';
import FilterItemRange from '../FilterItems/FilterItemRange';
import FilterItemMultiSelect from '../FilterItems/FilterItemMultiSelect';
import FilterRangeSlider from '../FilterItems/FilterRangeSlider';
import FilterCheckbox from '../FilterItems/FilterCheckbox';

interface IFilterCategory {
  showMore: boolean;
}

const FilterCategory: FC<IFilterCategory> = ({ showMore }) => {
  const filterMetaData = useContext(FilterContext);
  const [visibleFilters, setVisibleFilters] = useState<iFilterMetadata[]>([]);
  const [unVisibleFilters, setUnVisibleFilters] = useState<iFilterMetadata[]>([]);

  useEffect(() => {
    if (filterMetaData) {
      const filters = filterMetaData.getFilterInfo();
      const visibleFiltersArray = filters.filter((filterInfo) => filterInfo.visible);
      const unVisibleFiltersArray = filters.filter((filterInfo) => !filterInfo.visible);

      setVisibleFilters(visibleFiltersArray);
      setUnVisibleFilters(unVisibleFiltersArray);
    }
  }, [filterMetaData]);

  function getFilterType(filterMetadata) {
    if (filterMetadata?.range) {
      return 'range';
    }

    return filterMetadata?.filter?.constructor;
  }

  const renderFilter = (filterMetadata) => {
    switch (getFilterType(filterMetadata)) {
      case FilterRange:
        return <FilterItemRange key={filterMetadata.key} filterMetadata={filterMetadata} />;
      case FilterMultiSelect:
        return <FilterItemMultiSelect key={filterMetadata.key} filterMetadata={filterMetadata} />;
      case FilterSwitch:
        return <FilterCheckbox key={filterMetadata.key} filterMetadata={filterMetadata} />;
      case 'range':
        return <FilterRangeSlider key={filterMetadata.key} filterMetadata={filterMetadata} />;
      default:
        return null;
    }
  };

  return (
    <>
      {visibleFilters.map((filter) => renderFilter(filter))}
      {showMore && unVisibleFilters.map((filter) => renderFilter(filter))}
    </>
  );
};

export default FilterCategory;
