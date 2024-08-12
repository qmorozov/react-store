import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Iconify from '../../components/iconify';
import { ChangeEvent } from 'react';

interface IUsersTableToolbar {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const UsersTableToolbar = ({ value, onChange }: IUsersTableToolbar) => {
  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1, paddingRight: 1 }}>
        <TextField
          fullWidth
          value={value}
          onChange={onChange}
          placeholder="Search..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
    </Stack>
  );
};

export default UsersTableToolbar;
