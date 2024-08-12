import { ChangeEvent, FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Combobox as HeadlessUICombobox } from '@headlessui/react';

interface IOption {
  value: any;
  label: string;
}

interface ICombobox {
  options: IOption[];
  autoFocus?: boolean;
  placeholder?: string;
  onQueryChange?: (query: string) => void;
  onSelect?: (selectedOption: IOption['value']) => void;
}

const Combobox: FC<ICombobox> = memo(({ options, onSelect, onQueryChange, placeholder, autoFocus }) => {
  const [query, setQuery] = useState<string>('');
  const [selectedOption, setSelectedOption] = useState<IOption>(options[0]);
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');

  const prevDebouncedQuery = useRef<string>('');
  const prevOptions = useRef<IOption[]>([]);

  const getFilteredOptions = useCallback((debouncedQuery: string, options: IOption[]) => {
    return debouncedQuery
      ? options.filter((option) => option.label.toLowerCase().trim().includes(debouncedQuery.toLowerCase().trim()))
      : options;
  }, []);

  const filteredOptions = useMemo(
    () => getFilteredOptions(debouncedQuery, options),
    [getFilteredOptions, debouncedQuery, options],
  );

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.trim() === '') {
      setDebouncedQuery('');
    } else {
      setQuery(event.target.value);
    }
  }, []);

  const handleSelectedOptionChange = useCallback(
    (option: any) => {
      setSelectedOption(option);
      if (onSelect) {
        onSelect(option.value);
      }
    },
    [onSelect],
  );

  useMemo(() => {
    if (!options.includes(selectedOption)) {
      setSelectedOption(options[0]);
    }
  }, [options, selectedOption]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
      if (onQueryChange) {
        onQueryChange(query);
      }
    }, 400);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query, onQueryChange]);

  useEffect(() => {
    if (prevDebouncedQuery.current !== debouncedQuery || prevOptions.current !== options) {
      prevDebouncedQuery.current = debouncedQuery;
      prevOptions.current = options;
    }
  }, [filteredOptions]);

  return (
    <label className="select form-label --combobox">
      <p className="form-label__placeholder">{placeholder}</p>
      <HeadlessUICombobox
        value={selectedOption?.label || options[0]?.label || ''}
        onChange={handleSelectedOptionChange}
      >
        <div>
          <HeadlessUICombobox.Input onChange={handleInputChange} autoFocus={autoFocus} />
        </div>
        {query && (
          <HeadlessUICombobox.Options>
            {filteredOptions.map((option, index) => {
              const startIndex = option.label.toLowerCase().indexOf(debouncedQuery.toLowerCase());
              const endIndex = startIndex + debouncedQuery.length;

              return (
                <HeadlessUICombobox.Option
                  value={option}
                  data-highlight={debouncedQuery}
                  key={`${option.label}_${index}`}
                >
                  {option.label.trim().slice(0, startIndex)}
                  <i className="--highlight">{option.label.trim().slice(startIndex, endIndex)}</i>
                  {option.label.trim().slice(endIndex)}
                </HeadlessUICombobox.Option>
              );
            })}
          </HeadlessUICombobox.Options>
        )}
      </HeadlessUICombobox>
    </label>
  );
});

export default Combobox;
