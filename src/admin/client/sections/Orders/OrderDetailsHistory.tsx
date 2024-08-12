import { Box, Card, CardHeader, Paper, Stack, Typography } from '@mui/material';
import { fDateTime } from '../../utils/format-time';
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  timelineItemClasses,
  TimelineSeparator,
} from '@mui/lab';
import Timeline from '@mui/lab/Timeline';
import { OrderStatus } from '../../../../cart/model/OrderStatus.enum';

const OrderDetailsHistory = ({ createdAt }: any) => {
  const renderSummary = (
    <Stack
      spacing={2}
      component={Paper}
      variant="outlined"
      sx={{
        p: 2.5,
        minWidth: 260,
        flexShrink: 0,
        borderRadius: 2,
        typography: 'body2',
        borderStyle: 'dashed',
      }}
    >
      <Stack spacing={0.5}>
        <Box sx={{ color: 'text.disabled' }}>Order time</Box>
        {fDateTime(createdAt)}
      </Stack>
    </Stack>
  );

  const history = [
    {
      id: OrderStatus.Pending,
      title: OrderStatus[OrderStatus.Pending].toString(),
      status: 'Just now',
    },
    {
      id: OrderStatus.Processing,
      title: OrderStatus[OrderStatus.Processing].toString(),
      status: 'Confirmation',
    },
    {
      id: OrderStatus.Shipped,
      title: OrderStatus[OrderStatus.Shipped].toString(),
      status: 'May 26-29',
    },
    {
      id: OrderStatus.Delivered,
      title: OrderStatus[OrderStatus.Delivered].toString(),
      status: 'May 26-29',
    },
  ];

  const renderTimeline = (
    <Timeline
      sx={{
        p: 0,
        m: 0,
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {history.map(({ id, title, status }) => (
        <TimelineItem key={id}>
          <TimelineSeparator>
            <TimelineDot color={'grey'} />
            <TimelineConnector />
          </TimelineSeparator>

          <TimelineContent>
            <Typography variant="subtitle2">{title}</Typography>

            <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>{status}</Box>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );

  return (
    <Card>
      <CardHeader title="History" />
      <Stack
        spacing={3}
        alignItems={{ md: 'flex-start' }}
        direction={{ xs: 'column-reverse', md: 'row' }}
        sx={{ p: 3 }}
      >
        {renderTimeline}

        {renderSummary}
      </Stack>
    </Card>
  );
};

export default OrderDetailsHistory;
