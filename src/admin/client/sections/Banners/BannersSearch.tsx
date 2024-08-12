import { Autocomplete, autocompleteClasses, TextField, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../../components/iconify';
import SearchNotFound from '../../components/search-not-found';
import { useRouter } from '../../routes/hooks/use-router';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

type Props = {
  query: string;
  results: any[];
  onSearch: any;
  hrefItem: (id: string) => void;
};

const BannersSearch = ({ query, results, onSearch, hrefItem }: Props) => {
  const router = useRouter();

  const handleClick = (id) => {
    hrefItem(id);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (query) {
      if (event.key === 'Enter') {
        const selectProduct = results.filter((tour) => tour.name === query)[0];

        handleClick(selectProduct.id);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.name}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            minWidth: 320,
          },
        },
        paper: {
          sx: {
            [` .${autocompleteClasses.option}`]: {
              pl: 0.75,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, tour, { inputValue }) => {
        const matches = match(tour.name, inputValue);
        const parts = parse(tour.name, matches);

        return (
          <Box component="li" {...props} key={tour.id}>
            <div key={inputValue}>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  onClick={() => handleClick(tour.id)}
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </div>
          </Box>
        );
      }}
    />
  );
};

export default BannersSearch;
