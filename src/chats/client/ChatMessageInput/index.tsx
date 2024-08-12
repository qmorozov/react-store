import React, { FC, FormEvent, MouseEvent, useContext, useEffect, useRef, useState } from 'react';
import { useTranslations } from '../../../translation/translation.context';
import { ChatsApi } from '../chats.api.client';
import { ChatsData } from '../chatsContext';
import { ImageFile, useAddImage } from '../../../layouts/shared/AddImage/useAddImage';
import AddImage from '../../../layouts/shared/AddImage';

interface IChatMessageInput {
  fetchChatData: () => void;
  setChat: React.Dispatch<React.SetStateAction<any>>;
}

const ChatMessageInput: FC<IChatMessageInput> = ({ setChat, fetchChatData }) => {
  const tr = useTranslations();

  const { setChatList, uuid, productUUID } = useContext(ChatsData);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { selectedImages, onSelectFile, deleteHandler, setSelectedImages } = useAddImage(false, 1);

  const [isValidForm, setIsValidForm] = useState<boolean>(true);

  useEffect(() => {
    validateForm();
  }, [selectedImages.length, textareaRef.current?.value]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [uuid]);

  const textareaInputHandler = (): void => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '18px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 100)}px`;
      validateForm();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (isValidForm) {
        handleSubmit(event as unknown as FormEvent<HTMLFormElement>);
      }
    } else if (event.key === 'Enter' && event.shiftKey) {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.value += '\n';
        textarea.style.height = `${Math.min(textarea.scrollHeight, 100)}px`;
      }
    }
  };

  const validateForm = (): void => {
    const isFormValid = !!textareaRef.current?.value.trim() || selectedImages.length > 0;
    setIsValidForm(isFormValid);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const formData = new FormData();
    if (selectedImages.length > 0) {
      formData.append('image', selectedImages[0] as Blob);
    }
    formData.append('message', textareaRef.current?.value || '');
    formData.append('product', productUUID);

    setSelectedImages([]);
    setIsValidForm(false);
    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.style.height = '18px';
    }

    try {
      const messageResponse = await ChatsApi.sendMessage(formData, uuid);

      setChat((prevChat: any) => ({
        ...prevChat,
        messages: [messageResponse, ...prevChat.messages],
      }));

      await fetchChatData();
      const chatsList = await ChatsApi.getChatsList();
      setChatList(chatsList);
    } catch (error) {
      console.error(error);
    }
  };

  const renderSelectedImages = (): JSX.Element | null => {
    if (selectedImages.length === 0) {
      return null;
    }

    return (
      <ul className="chat-input__images">
        {selectedImages.map((image: ImageFile, index: number) => (
          <li key={index}>
            <button onClick={(event: MouseEvent<HTMLButtonElement>) => deleteHandler(image, event)}>
              <span></span>
            </button>
            <img src={image.preview} alt={`message-image-${index}`} />
          </li>
        ))}
      </ul>
    );
  };
  const formClickHandler = (): void => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="chat-input">
      {renderSelectedImages()}

      <form onSubmit={handleSubmit} onClick={formClickHandler}>
        <AddImage
          maxImages={1}
          showPreview={false}
          onSelectFile={onSelectFile}
          deleteHandler={deleteHandler}
          selectedImages={selectedImages}
        >
          <label title={tr.get('chats.selectFileTitle')}>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp, image/avif"
              onChange={onSelectFile}
              multiple={false}
            />
            <i className="icon icon-attachment"></i>
          </label>
        </AddImage>

        <textarea
          ref={textareaRef}
          onInput={textareaInputHandler}
          onKeyDown={handleKeyDown}
          placeholder={tr.get('chats.textarea')}
        />

        <button type="submit" title={tr.get('chats.buttonTitle')} disabled={!isValidForm}>
          <i className="icon icon-send-message"></i>
        </button>
      </form>
    </div>
  );
};

export default ChatMessageInput;
