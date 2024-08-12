import { toast } from 'react-toastify';
import { useCallback } from 'react';

export const useNotification = () => {
  const showSuccess = useCallback((message: string, incomingSettings) => {
    const successSettings = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      closeButton: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    };

    const settings = Object.assign(successSettings, incomingSettings);
    return toast.success(message, settings);
  }, []);

  const showError = useCallback((message: string, incomingSettings) => {
    const errorSettings = {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeButton: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    };

    const settings = Object.assign(errorSettings, incomingSettings);
    toast.error(message, settings);
  }, []);

  return {
    showErrorNotification: showError,
    showSuccessNotification: showSuccess,
  };
};
