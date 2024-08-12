import { ChangeEvent, FC, MouseEvent, ReactChild, useEffect, useState } from 'react';
import { ImageFile, ISavedFiles } from './useAddImage';
import Loader from '../Loader';

interface IAddImage {
  multiple?: boolean;
  placeholder?: string;
  classes?: string;
  children?: ReactChild;
  uploadingImages?: any;
  uploadStatus?: any;
  disabled?: boolean;
  uploading?: boolean;
  maxImages?: number;
  coverImageId?: string;
  handleCoverImage?: (id: string) => void;
  selectedImages: (ImageFile | ISavedFiles)[];
  removeImageFromServer?: (id: string) => void;
  onSelectFile: (event: ChangeEvent<HTMLInputElement>) => void;
  deleteHandler: (image: ImageFile | ISavedFiles, event: MouseEvent<HTMLButtonElement>) => void;
  showCoverButton?: boolean;
  showPreview?: boolean;
}

const AddImage: FC<IAddImage> = ({
  multiple = true,
  placeholder,
  classes,
  children,
  selectedImages,
  onSelectFile,
  deleteHandler,
  uploading,
  uploadStatus,
  disabled,
  maxImages = Infinity,
  removeImageFromServer,
  handleCoverImage,
  coverImageId,
  showCoverButton = true,
  showPreview = true,
}) => {
  const [visibleInput, setVisibleInput] = useState(multiple || selectedImages.length === 0);
  const [focused, setFocused] = useState<boolean>(false);

  useEffect(() => {
    if (!multiple && selectedImages.length === 1) {
      setVisibleInput(false);
    } else {
      setVisibleInput(selectedImages.length < (maxImages ?? Infinity));
    }
  }, [multiple, selectedImages, maxImages]);

  return (
    <div className="add-image" title={placeholder}>
      {showPreview && selectedImages.length ? (
        <ul className="add-image__items">
          {selectedImages.map((image, index) => (
            <li
              key={index}
              className={
                uploadStatus ? (uploadStatus[index]?.uploaded ? '--uploaded' : uploadStatus[index] && '--loading') : ''
              }
            >
              {image.id && showCoverButton && (
                <button
                  type="button"
                  tabIndex={0}
                  disabled={disabled || uploading}
                  onClick={() => handleCoverImage(image.id)}
                  className={`btn --primary add-image__cover ${coverImageId === image.id ? '--cover' : ''}`}
                >
                  Use as a cover
                </button>
              )}
              <img src={(image as any).preview} alt={`image-preview-${index}`} />
              {uploadStatus && uploadStatus[index]?.uploaded ? (
                <i className="icon icon-unread-message" />
              ) : uploadStatus && uploadStatus[index] ? (
                <Loader />
              ) : null}
              <button
                title="Remove image"
                disabled={disabled || uploading}
                className="btn --primary add-image__remove"
                onClick={(event: MouseEvent<HTMLButtonElement>) => {
                  if (!disabled && !uploading) {
                    deleteHandler(image, event);

                    if (image.id) {
                      removeImageFromServer(image.id);
                    }

                    if (!multiple) {
                      setVisibleInput(true);
                    }
                  }
                }}
                tabIndex={0}
              >
                Remove image
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {!children && visibleInput ? (
        <label
          className={`add-image__input ${disabled ? '--disabled' : ''} ${classes ? classes : ''} ${
            focused ? '--focused' : ''
          }`}
        >
          <input
            type="file"
            multiple={multiple}
            disabled={disabled}
            onChange={onSelectFile}
            accept="image/png , image/jpeg, image/webp, image/avif"
            tabIndex={0}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <i className="icon icon-attachment"></i>
          <span>{placeholder}</span>
        </label>
      ) : (
        children
      )}
    </div>
  );
};

export default AddImage;
