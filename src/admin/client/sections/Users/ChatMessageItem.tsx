import React from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
import { Avatar, Box, Stack, Typography } from '@mui/material';
import { getCurrencySymbol } from '../../../../payment/model/currency.info';
import Link from '@mui/material/Link';

const ChatMessageItem = ({ message }: any) => {
  const { isFromCurrentUser, sender, createdAt } = message;

  const hasImage = message?.images || message?.product;

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{
        mb: 1,
        color: 'text.disabled',
        ...(!isFromCurrentUser && {
          mr: 'auto',
        }),
      }}
    >
      {sender.name}, &nbsp;
      {formatDistanceToNowStrict(new Date(createdAt), {
        addSuffix: true,
      })}
    </Typography>
  );

  console.log(message.product);

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: '#F4F6F8',
        ...(isFromCurrentUser && {
          color: 'grey.800',
          bgcolor: '#C8FAD6',
        }),
        ...(hasImage && {
          p: 0,
          bgcolor: 'transparent',
        }),
      }}
    >
      {hasImage ? (
        <>
          {!message?.product ? (
            <>
              <Box
                component="img"
                alt="attachment"
                src={message?.images?.[0].url || message?.product?.images?.[0].medium}
                sx={{
                  minHeight: 220,
                  borderRadius: '6px 6px 0 0',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              />
            </>
          ) : (
            <Link
              href={'/product/' + message?.product?.url}
              style={{ display: 'contents', color: 'inherit' }}
              target="_blank"
            >
              <Box
                component="img"
                alt="attachment"
                src={message?.images?.[0].url || message?.product?.images?.[0].medium}
                sx={{
                  minHeight: 220,
                  borderRadius: '6px 6px 0 0',
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 0.9,
                  },
                }}
              />
              {message?.product && (
                <div
                  style={{
                    padding: 12,
                    minWidth: 48,
                    maxWidth: 320,
                    borderRadius: 1,
                    backgroundColor: '#F4F6F8',
                    ...(isFromCurrentUser && {
                      color: 'grey.800',
                      backgroundColor: '#C8FAD6',
                    }),
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <Typography>
                    <b>{message.product?.title}</b>
                  </Typography>
                  <Typography>
                    Model: <b>{message.product?.model}</b>
                  </Typography>
                  <Typography>
                    Type: <b>{message.product?.type}</b>
                  </Typography>
                  <Typography>
                    Price:
                    <b>
                      {' '}
                      {getCurrencySymbol(message.product?.currency)}
                      {message.product?.price}
                    </b>
                  </Typography>
                </div>
              )}
            </Link>
          )}
        </>
      ) : (
        message.message
      )}
    </Stack>
  );

  return (
    <Stack direction="row" justifyContent={isFromCurrentUser ? 'flex-end' : 'unset'} sx={{ mb: 5 }}>
      <Avatar alt={sender.name} src={sender.image} sx={{ width: 32, height: 32, mr: 2 }} />

      <Stack alignItems="flex-end">
        {renderInfo}

        <Stack
          direction="row"
          alignItems="center"
          sx={{
            ...(!isFromCurrentUser && {
              marginRight: 'auto',
            }),
            position: 'relative',
            '&:hover': {
              '& .message-actions': {
                opacity: 1,
              },
            },
          }}
        >
          {renderBody}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ChatMessageItem;
