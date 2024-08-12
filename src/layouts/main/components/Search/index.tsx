import { Combobox, Transition } from '@headlessui/react';
import { Translations } from '../../../../translation/translation.provider.client';
import { RenderClientPage } from '../../../../app/client/render-client-page';
import { MainLayoutServiceClient } from '../../main.client.service';
import { ChangeEvent, FormEvent, Fragment, useEffect, useRef, useState, KeyboardEvent } from 'react';
import { SearchSuggestionType } from '../../../../catalog/models/search-suggestion';

import './index.scss';

interface ISuggestion {
  id: string;
  suggestion: string;
  type: string;
}

(async (searchElementId) => {
  const tr = await Translations.load('header', 'common', 'error');
  const search = document.getElementById(searchElementId)?.dataset?.searchDefaultvalue;

  return RenderClientPage(() => {
    const [value, setValue] = useState<string>(search ? search : '');
    const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
    const valueRef = useRef<string>('');

    const isSearchEmpty = value.trim() === '';

    const getHighlightedText = (text: string, highlight: string) => {
      const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
      return parts.map((part: string, index: number) => (
        <Fragment key={index}>
          {part.toLowerCase() === highlight.toLowerCase() ? (
            <span className="search-query highlighted">{part}</span>
          ) : (
            <span className="search-query">{part}</span>
          )}
        </Fragment>
      ));
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
      const newValue = event.target.value;
      setValue(newValue);
      valueRef.current = newValue;
    };

    const handleOnSubmit = (event: FormEvent<HTMLFormElement> | KeyboardEvent<HTMLInputElement>): void => {
      if (event instanceof Event) {
        event.preventDefault();
      }
      window.location.replace(tr.link(`/search?query=${valueRef.current}`));
    };

    const handleQuery = (suggestion: ISuggestion) => {
      if (suggestion.type === SearchSuggestionType.Category) {
        window.location.replace(tr.link(`/catalog/${suggestion.id}`));
      } else if (suggestion.type === SearchSuggestionType.QueryInCategory) {
        window.location.replace(tr.link(`/catalog/${suggestion.id}?search=${valueRef.current}`));
      } else {
        window.location.replace(tr.link(`/search?query=${suggestion.suggestion}`));
      }
    };

    const suggestionQuery = suggestions.filter((suggestion: ISuggestion) =>
      suggestion.type === SearchSuggestionType.Query ? suggestion : null,
    );
    const suggestionInCategory = suggestions.filter((suggestion: ISuggestion) =>
      suggestion.type === SearchSuggestionType.QueryInCategory ? suggestion : null,
    );
    const suggestionCategory = suggestions.filter((suggestion: ISuggestion) =>
      suggestion.type === SearchSuggestionType.Category ? suggestion : null,
    );

    useEffect(() => {
      async function searchSuggestions() {
        if (value.length > 2) {
          const response = await MainLayoutServiceClient.searchSuggestion(value);
          setSuggestions(response);
        } else {
          setSuggestions([]);
        }
      }

      searchSuggestions();
    }, [value]);

    return (
      <>
        <Combobox onChange={handleQuery}>
          <form className="header__search" method="GET" action="/search" onSubmit={handleOnSubmit}>
            <div className="header__search__block">
              <i className="icon icon-search" />
              <Combobox.Input
                name="query"
                value={value}
                type="search"
                placeholder={tr.get('header.SearchFormInput')}
                onChange={handleChange}
                onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleOnSubmit(event);
                  }
                }}
              />
            </div>
            <button type="submit" className="btn --primary" disabled={isSearchEmpty}>
              <span>{tr.get('header.SearchFormButton')}</span>
              <i className="icon icon-search" />
            </button>
          </form>
          <Transition as={Fragment} afterLeave={() => setValue('')}>
            <Combobox.Options className="suggestion">
              {value && value.length > 2 && suggestionQuery.length > 0 && (
                <div className="container --small suggestion__options --value">
                  {suggestionQuery.every(
                    (suggestion) => suggestion.suggestion.toLowerCase() !== value.toLowerCase(),
                  ) && (
                    <Combobox.Option
                      value={{ id: '', suggestion: value, type: '' }}
                      onClick={() => {
                        handleQuery({ id: '', suggestion: value, type: '' });
                      }}
                    >
                      {({ active }) => (
                        <div className={`suggestion__link ${active && 'active'}`}>
                          <a>{getHighlightedText(value, value)}</a>
                        </div>
                      )}
                    </Combobox.Option>
                  )}
                </div>
              )}
              {suggestions.length > 1 ? (
                <div className="container --small suggestion__options">
                  {value &&
                    value.length > 2 &&
                    suggestionQuery.length > 0 &&
                    suggestionQuery.map((suggestion: ISuggestion, index: number) => {
                      return (
                        <Combobox.Option
                          value={suggestion}
                          key={index}
                          onClick={() => {
                            handleQuery(suggestion);
                          }}
                        >
                          {({ active }) => (
                            <>
                              <div className={`suggestion__link ${active && 'active'}`}>
                                <a>{getHighlightedText(suggestion.suggestion, value)}</a>
                              </div>
                            </>
                          )}
                        </Combobox.Option>
                      );
                    })}
                  {value.length > 2 && suggestionInCategory.length > 0 && (
                    <>
                      <p className="suggestion__category">{tr.get('header.SearchInCategories')}</p>
                      {suggestionInCategory.map((suggestion: ISuggestion) => {
                        return (
                          <Combobox.Option value={suggestion} className="suggestion__search" key={suggestion.id}>
                            {({ active }) => (
                              <>
                                <div
                                  className="searchCategory suggestionLink"
                                  onClick={() => {
                                    handleQuery(suggestion);
                                  }}
                                >
                                  <div className="searchCategory__block">
                                    <i className="icon icon-search" />
                                    {active ? (
                                      <div className={`suggestion__link ${active && 'active'}`}>
                                        {getHighlightedText(value, value)}
                                        <span className="searchInCategory">{`${tr.get('header.InCategory')} ${
                                          suggestion.suggestion
                                        }`}</span>
                                      </div>
                                    ) : (
                                      <div className="suggestion__link">
                                        {getHighlightedText(value, value)}
                                        <span className="searchInCategory">
                                          {`${tr.get('header.InCategory')}
                                        ${suggestion.suggestion}`}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </Combobox.Option>
                        );
                      })}
                    </>
                  )}
                  {value.length > 2 &&
                    suggestionCategory.length > 0 &&
                    suggestionCategory.map((suggestion: ISuggestion, index: number) => {
                      return (
                        <Combobox.Option
                          value={suggestion}
                          key={index}
                          onClick={() => {
                            handleQuery(suggestion);
                          }}
                        >
                          {({ active }) => (
                            <>
                              <div className={`suggestion__link ${active && 'active'}`}>
                                <a>{getHighlightedText(suggestion.suggestion, value)}</a>
                              </div>
                            </>
                          )}
                        </Combobox.Option>
                      );
                    })}
                </div>
              ) : null}
            </Combobox.Options>
          </Transition>
        </Combobox>
      </>
    );
  }, searchElementId);
})('search');
