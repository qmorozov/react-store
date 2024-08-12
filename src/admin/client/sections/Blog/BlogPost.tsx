import { CardContent, Typography, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import Iconify from '../../components/iconify';
import TextMaxLine from '../../components/text-max-line';
import Card from '@mui/material/Card';
import Image from '../../components/image';
import { alpha } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { useBoolean } from '../../hooks/use-boolean';
import CustomPopover, { usePopover } from '../../components/custom-popover';
import MenuItem from '@mui/material/MenuItem';
import { ConfirmDialog } from '../../components/custom-dialog';
import Button from '@mui/material/Button';
import { fDate } from '../../utils/format-time';
import { removeHtmlTags } from '../FAQ/FAQTableRow';

const BlogPost = ({ post, handleDelete }: any) => {
  const theme = useTheme();

  const { image, active, url, title, id, createdAt, content } = post;

  return (
    <Card>
      <Link
        to={'/blog/post/' + url}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          cursor: active ? 'pointer' : 'auto',
        }}
        target="_blank"
      >
        <Image
          alt={title}
          src={image}
          overlay={active ? 'none' : alpha(theme.palette.grey[900], 0.8)}
          sx={{
            width: 1,
            height: 360,
          }}
        />
      </Link>

      <PostContent
        post={{
          id,
          url,
          title,
          active,
          content,
          createdAt,
        }}
        onRemove={(id) => handleDelete(id)}
      />
    </Card>
  );
};

export default BlogPost;

export function PostContent({ post, onRemove }: any) {
  const confirm = useBoolean();

  const navigate = useNavigate();

  const popover = usePopover();

  const { id, title, content, createdAt, url, active } = post;

  const truncatedContent = content.length > 250 ? content.slice(0, 250) + '...' : content;

  return (
    <>
      <CardContent>
        <Link
          to={'/blog/post/' + url}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            cursor: active ? 'pointer' : 'auto',
          }}
          target="_blank"
        >
          <Typography
            variant="caption"
            component="div"
            sx={{
              mb: 1,
              color: 'text.disabled',
            }}
          >
            {fDate(createdAt)}
          </Typography>

          <TextMaxLine variant={'h5'} line={2} persistent>
            {title}
          </TextMaxLine>

          <TextMaxLine variant={'subtitle2'} line={2} persistent>
            {removeHtmlTags(truncatedContent)}
          </TextMaxLine>
        </Link>

        <Stack
          spacing={1.5}
          direction="row"
          alignItems="flex-end"
          justifyContent="flex-end"
          sx={{
            mt: 3,
            typography: 'caption',
            color: 'text.disabled',
          }}
        >
          {/*<Stack direction="row" alignItems="center">*/}
          {/*  <Iconify icon="solar:eye-bold" width={16} sx={{ mr: 0.5 }} />*/}
          {/*  23*/}
          {/*</Stack>*/}

          <IconButton
            color={popover.open ? 'inherit' : 'default'}
            onClick={(e) => {
              e.stopPropagation();
              popover.onOpen(e);
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </Stack>
      </CardContent>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            navigate('/admin/blog/manage/' + id);
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Edit
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              popover.onClose();
              onRemove(id);
            }}
          >
            Delete
          </Button>
        }
      />
    </>
  );
}
