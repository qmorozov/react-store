import { FC, useState, useEffect } from 'react';
import { iFilterMetadata } from '../../../models/filter/filter.abstract';
import { useTranslations } from '../../../../translation/translation.context';
import FormControl from '../../../../layouts/shared/FormControl';

interface IFilterCheckbox {
  filterMetadata: iFilterMetadata<any>;
}

const FilterCheckbox: FC<IFilterCheckbox> = ({ filterMetadata }) => {
  const tr = useTranslations();

  const [isChecked, setIsChecked] = useState(filterMetadata.filter.checked);

  useEffect(() => {
    setIsChecked(filterMetadata.filter.checked);
  }, [filterMetadata.filter.checked]);

  const handleSelectedChange = (value: boolean) => {
    if (value) {
      filterMetadata.filter.checked = true;
    } else {
      delete filterMetadata.filter.checked;
    }

    setIsChecked(value);
  };

  return (
    <fieldset className="filter filter__item --one-checkbox-filter">
      <div className="form-group__close">
        <FormControl type="checkbox" placeholder={tr.get(filterMetadata.title)}>
          <input
            type="checkbox"
            checked={isChecked || ''}
            name={filterMetadata.key}
            onChange={(event) => handleSelectedChange(event.target.checked)}
          />
        </FormControl>
        {filterMetadata.tip && <span className="tooltip --right" data-tooltip={tr.get(filterMetadata.tip)}></span>}
      </div>
    </fieldset>
  );
};

export default FilterCheckbox;
