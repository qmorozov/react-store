import Box from '@mui/material/Box';
import Scrollbar from '../../components/scrollbar';
import useMessagesScroll from '../../hooks/use-messages-scroll';
import ChatMessageItem from './ChatMessageItem';
import Typography from '@mui/material/Typography';

type Props = {
  messages: any[];
  isChatEmpty: boolean;
};

export default function ChatMessageList({ messages = [], isChatEmpty }: Props) {
  const { messagesEndRef } = useMessagesScroll(messages);

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 3, py: 5, height: '55vh', overflowY: 'auto' }}>
        <Box>
          {!isChatEmpty ? (
            messages.map((message) => <ChatMessageItem key={message.id} message={message} />)
          ) : (
            <Typography variant="h5" style={{ textAlign: 'center' }}>
              This user has no chats
            </Typography>
          )}
        </Box>
      </Scrollbar>
    </>
  );
}
