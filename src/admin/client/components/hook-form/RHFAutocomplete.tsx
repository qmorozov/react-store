import { useFormContext, Controller } from 'react-hook-form';
// @mui
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';

// ----------------------------------------------------------------------

interface Props<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
> extends AutocompleteProps<T, Multiple, DisableClearable, FreeSolo> {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: React.ReactNode;
}

export default function RHFAutocomplete({ name, label, placeholder, helperText, value, onChange, ...other }: any) {
  const handleOnChange = (event, newValue) => {
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Autocomplete
      value={value}
      onChange={handleOnChange}
      renderInput={(params) => (
        <TextField label={label} placeholder={placeholder} helperText={helperText} {...params} />
      )}
      {...other}
    />
  );
}
