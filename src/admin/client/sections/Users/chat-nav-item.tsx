import { formatDistanceToNowStrict } from 'date-fns';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

type Props = {
  selected: boolean;
  collapse: boolean;
  onCloseMobile: VoidFunction;
  navItem: any;
  getChatUuid: any;
};

export default function ChatNavItem({ selected, getChatUuid, collapse, navItem, onCloseMobile }: Props) {
  const renderSingle = (
    <Badge variant="standard" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
      <Avatar alt={navItem.addressee.name} src={navItem.addressee.image} sx={{ width: 48, height: 48 }} />
    </Badge>
  );

  return (
    <ListItemButton
      disableGutters
      onClick={() => getChatUuid(navItem.uuid)}
      sx={{
        py: 1.5,
        px: 2.5,
        ...(selected && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <Badge color="error" overlap="circular">
        {renderSingle}
      </Badge>

      {!collapse && (
        <>
          <ListItemText
            sx={{ ml: 2 }}
            primary={navItem.addressee.name}
            primaryTypographyProps={{
              noWrap: true,
              variant: 'subtitle2',
            }}
            secondary={navItem.lastMessage.message || navItem.product?.title || 'image'}
            secondaryTypographyProps={{
              noWrap: true,
              component: 'span',
              variant: 'subtitle2',
              color: 'text.primary',
            }}
          />

          <Stack alignItems="flex-end" sx={{ ml: 2, height: 44 }}>
            <Typography
              noWrap
              variant="body2"
              component="span"
              sx={{
                mb: 1.5,
                fontSize: 12,
                color: 'text.disabled',
              }}
            >
              {!collapse &&
                formatDistanceToNowStrict(new Date(navItem.lastMessage.createdAt), {
                  addSuffix: false,
                })}
            </Typography>
          </Stack>
        </>
      )}
    </ListItemButton>
  );
}
