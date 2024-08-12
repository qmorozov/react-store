import { ChangeEvent, FC, useMemo, useState } from 'react';
import { iFilterMetadata } from '../../../models/filter/filter.abstract';
import { FilterMultiSelect } from '../../../models/filter/filter.type';
import { useTranslations } from '../../../../translation/translation.context';
import FormControl from '../../../../layouts/shared/FormControl';

type FilterGroupData = {
  id: number;
  value: string;
  name: string;
  image?: string;
  isPopular?: boolean;
};

interface IFilterItemMultiSelect {
  filterMetadata: iFilterMetadata<FilterMultiSelect<any>>;
}

const FilterItemMultiSelect: FC<IFilterItemMultiSelect> = ({ filterMetadata }) => {
  if (filterMetadata.filter.list.length < 2) {
    return null;
  }

  const noBrandIndex = filterMetadata.filter.list.findIndex((item) => item.url === 'no-brands');

  if (noBrandIndex !== -1) {
    filterMetadata.filter.list.splice(noBrandIndex, 1);
  }

  const tr = useTranslations();
  const [searchValue, setSearchValue] = useState('');
  const [selected, setSelected] = useState(filterMetadata.filter.selected);

  const handleSelectedChange = (id: number, value: boolean) => {
    if (value) {
      filterMetadata.filter.selected[id] = true;
    } else {
      delete filterMetadata.filter.selected[id];
    }
    setSelected({ ...filterMetadata.filter.selected });
  };

  const handleSearchValue = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  type listGroup = {
    label?: string;
    items: FilterGroupData[];
  };

  const alphabeticalGroups = useMemo(() => {
    const filteredData = searchValue?.length
      ? filterMetadata.filter.list.filter((item) => item.name.toLowerCase().includes(searchValue.toLowerCase()))
      : filterMetadata.filter.list;
    const sortedData = filteredData.sort((a, b) => a.name.localeCompare(b.name));

    const listOfGroups: listGroup[] = [];

    if (!filterMetadata.group) {
      listOfGroups.push({
        items: sortedData,
      });
    } else {
      const popularGroup: listGroup = {
        items: [],
      };

      const numberGroup: listGroup = {
        items: [],
      };

      const itemsByChar: { [key: string]: listGroup } = {};

      sortedData.forEach((d) => {
        if (d.isPopular) {
          popularGroup.items.push(d);
        }

        const firstChar = d.name[0].toLowerCase();
        const isNumber = !isNaN(Number(firstChar));

        if (isNumber) {
          numberGroup.items.push(d);
        } else {
          const group =
            itemsByChar[firstChar] ||
            (itemsByChar[firstChar] = {
              label: firstChar,
              items: [],
            });
          group.items.push(d);
        }
      });

      if (popularGroup?.items?.length) {
        listOfGroups.push(popularGroup);
      }

      if (numberGroup?.items?.length) {
        listOfGroups.push(numberGroup);
      }

      return [...listOfGroups, ...Object.values(itemsByChar)];
    }

    return listOfGroups;
  }, [filterMetadata, searchValue]);

  return (
    <fieldset className="filter filter__item filter__item-select">
      {filterMetadata.filter.list.length > 10 ? (
        <FormControl placeholder={tr.get(filterMetadata.title)} icon={<i className="icon icon-search" />}>
          <input onChange={handleSearchValue} value={searchValue} />
        </FormControl>
      ) : (
        <p className="form-label__placeholder">{tr.get(filterMetadata.title)}</p>
      )}
      <div className="--select">
        {alphabeticalGroups.map((group, index) => (
          <div className="filter__item-group" key={index}>
            {group.label && <span>{group.label}</span>}
            {group.items.map(({ id, name, value }) => (
              <FormControl type="checkbox" key={id} placeholder={name}>
                <input
                  type="checkbox"
                  checked={selected[id] || ''}
                  onChange={(event) => {
                    handleSelectedChange(id, event.target.checked);
                  }}
                  name={value}
                />
              </FormControl>
            ))}
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default FilterItemMultiSelect;
