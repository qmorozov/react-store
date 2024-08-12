import { ChangeEvent, useState, MouseEvent } from 'react';
import { useNotification } from '../../../admin/hooks/useNotification';

export interface ImageFile extends File {
  id?: string;
  preview: string;
  canUpload: true;
  uploaded?: boolean;
}

export interface ISavedFiles {
  id?: string;
  preview: string;
  canUpload: false;
}

export const useAddImage = (multiple = true, maxImages = Infinity) => {
  const { showErrorNotification } = useNotification();
  const [selectedImages, setSelectedImages] = useState<(ImageFile | ISavedFiles)[]>([]);

  const remainingImages = maxImages - selectedImages.length;

  const onSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);

    const newImagesArray = selectedFilesArray
      .filter((file: File) => {
        const isAlreadySelected = selectedImages.some((image) => (image as File).name === file.name);
        return !isAlreadySelected;
      })
      .map((file: File) => {
        const objectUrl = URL.createObjectURL(file);
        return Object.assign(file, { preview: objectUrl, canUpload: true });
      });

    const remainingImages = maxImages - selectedImages.length - newImagesArray.length;
    if (remainingImages < 0) {
      showErrorNotification(`You can select only ${maxImages} images.`, null);
      return;
    }

    if (multiple) {
      setSelectedImages((previousImages) => [...newImagesArray, ...previousImages]);
    } else {
      setSelectedImages(newImagesArray);
    }

    event.target.value = '';
  };

  const setImages = (images: any[]) => {
    if (images?.length) {
      setSelectedImages(
        images.map(({ preview, id }) => {
          return {
            id,
            preview,
            canUpload: false,
          };
        }),
      );
    }
  };

  const deleteHandler = (image: ImageFile, event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setSelectedImages(selectedImages.filter((item) => item !== image));
    URL.revokeObjectURL(image.preview);
  };

  return {
    setImages,
    onSelectFile,
    deleteHandler,
    selectedImages,
    remainingImages,
    setSelectedImages,
  };
};
