import { Listbox } from '@headlessui/react';
import { ChangeEvent, FC, useEffect, useMemo, useRef, useState } from 'react';
import FieldError from '../../../app/validation/FieldError';

export interface ISelectOption {
  id: number | string;
  value: number | string;
  label: string;
}

export interface ISelect {
  error?: any;
  classes?: string;
  disabled?: boolean;
  defaultText: string;
  placeholder?: string;
  options: ISelectOption[];
  defaultValue?: any;
  isSuggestProduct?: boolean;
  onChange?: (option: ISelectOption) => void;
}

const Select: FC<ISelect> = ({
  defaultText,
  disabled,
  onChange,
  classes,
  options,
  placeholder,
  error,
  defaultValue,
  isSuggestProduct,
}) => {
  const selectRef = useRef<HTMLDivElement>(null);

  const [searchValue, setSearchValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<ISelectOption | null>(null);
  const [selectedOptionValue, setSelectedOptionValue] = useState<ISelectOption['value'] | null>(
    defaultValue !== undefined ? defaultValue : null,
  );
  const filteredOptions = useMemo(
    () => options.filter(({ label }) => label.toLowerCase().includes(searchValue.toLowerCase())),
    [options, searchValue],
  );

  const shouldShowSearch = options.length > 5;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectRef]);

  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== null && !selectedOption) {
      const foundOption = options.find(({ value, id }) => value === defaultValue || id === defaultValue);
      setSelectedOption(foundOption || null);
      setSelectedOptionValue(foundOption?.value || null);
    }
  }, [defaultValue, options, selectedOption]);

  const onSelectOption = (option: ISelectOption) => {
    setIsOpen(false);
    setSelectedOptionValue(option.value);
    setSelectedOption(option);

    if (onChange) {
      onChange(option);
    }
  };

  const sortedOptions = useMemo(() => {
    const sorted = [...filteredOptions];
    sorted.sort((a, b) => a.label.localeCompare(b.label));

    return sorted;
  }, [filteredOptions]);

  return (
    <div
      className={`select form-label ${isOpen ? '--open' : ''} ${classes || ''} ${disabled ? '--disabled' : ''} ${
        error ? '--error' : ''
      } ${isSuggestProduct ? '--suggest-product' : ''}`}
      ref={selectRef}
    >
      {placeholder && <span className="form-label__placeholder">{placeholder}:</span>}
      <Listbox value={selectedOption} onChange={onSelectOption}>
        <Listbox.Button onClick={() => setIsOpen(!isOpen)}>
          <p>{selectedOption ? selectedOption.label : defaultText}</p>
          <i className="icon icon-arrow"></i>
        </Listbox.Button>
        <Listbox.Options>
          {shouldShowSearch && (
            <label className="select__search">
              <input
                value={searchValue}
                placeholder="Search..."
                onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
              />
              <i className="icon icon-search" />
            </label>
          )}
          {sortedOptions.length > 0 ? (
            sortedOptions.map(({ id, value, label }: ISelectOption) => (
              <Listbox.Option
                key={id}
                value={{ id, value, label }}
                onClick={() => onSelectOption({ id, value, label })}
                className={selectedOptionValue === value ? '--selected' : ''}
              >
                {label}
              </Listbox.Option>
            ))
          ) : (
            <li className="select__not-results">No results found</li>
          )}
        </Listbox.Options>
      </Listbox>
      <FieldError errors={error} />
    </div>
  );
};

export default Select;
