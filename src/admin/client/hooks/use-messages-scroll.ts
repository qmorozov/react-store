import { useCallback, useEffect, useRef } from 'react';

export default function useMessagesScroll(messages: any[]) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollMessagesToBottom = useCallback(() => {
    if (!messages) {
      return;
    }

    if (!messagesEndRef.current) {
      return;
    }

    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    scrollMessagesToBottom();
  }, [messages]);

  return {
    messagesEndRef,
  };
}
