import { FormEvent, forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { IProductData } from '../../manageProduct.client';
import { useTranslations } from '../../../../translation/translation.context';
import { ImageFile, ISavedFiles, useAddImage } from '../../../../layouts/shared/AddImage/useAddImage';
import { useNotification } from '../../../../admin/hooks/useNotification';
import { ManageProductApi } from '../manageProduct.api.client';
import AddImage from '../../../../layouts/shared/AddImage';
import { Basic } from '../manageProductContext';

interface IPhotos {
  productData: IProductData;
  setProductData: (productInfo: any) => void;
  setUploadingPhotos?: (uploadingPhotos: boolean) => void;
  handleAllPhotosUploaded?: (allPhotosUploaded: boolean) => void;
  setSelectedPhotos?: (selectedPhotos: (ImageFile | ISavedFiles)[]) => void;
}

const Photos = forwardRef(
  ({ productData, setProductData, setUploadingPhotos, handleAllPhotosUploaded, setSelectedPhotos }: IPhotos, ref) => {
    const tr = useTranslations();

    const { currentPlanData } = useContext(Basic);

    const [uploading, setUploading] = useState<boolean>(false);
    const { showSuccessNotification, showErrorNotification } = useNotification();
    const [uploadStatus, setUploadStatus] = useState<(ImageFile | ISavedFiles)[]>([]);
    const { selectedImages, onSelectFile, deleteHandler, setImages, remainingImages } = useAddImage(
      true,
      currentPlanData?.plan?.max_product_images || 0,
    );

    const handleSuccess = () => {
      let isClosed = false;
      showSuccessNotification(tr.get('manageProduct.notification.PhotoSuccessfullyAdded'), {
        autoClose: 1300,
        onClose: () => {
          isClosed = !isClosed;
          if (!isClosed) {
            window.location.href = tr.link(`/product/${productData.product.url}`);
          }
        },
      });
    };

    const handleError = (error: any) => {
      showErrorNotification(tr.get('manageProduct.notification.ErrorUploadingImages'), error.message);
    };

    useEffect(() => {
      if (uploadStatus.length > 0) {
        const uploaded = uploadStatus.every((image: ImageFile) => image.uploaded);

        if (handleAllPhotosUploaded) {
          handleAllPhotosUploaded(uploaded);
        }
      }
    }, [uploadStatus]);

    const uploadImages = async (
      productId: number,
      selectedImages: (ImageFile | ISavedFiles)[],
      isRedirect = true,
      customFunction?,
    ) => {
      try {
        setUploading(true);
        for (const file of selectedImages) {
          if (file instanceof File && file.type.startsWith('image/')) {
            if (uploadStatus.find((item) => item.preview === file.preview)) {
              continue;
            }
            setUploadStatus((status) => [...status, file]);
            await ManageProductApi.addProductImages(productId, file as File).then(({ images }) => {
              setProductData((prevData) => ({
                ...prevData,
                product: {
                  ...prevData.product,
                  images,
                },
              }));
            });
            // @ts-ignore
            setUploadStatus((status) =>
              status.map((item) => (item.preview === file.preview ? { ...item, uploaded: true } : item)),
            );
          }
        }
        if (customFunction) {
          customFunction();
        }
        if (isRedirect) {
          handleSuccess();
        }
      } catch (error) {
        handleError(error);
      }
    };

    useEffect(() => {
      if (productData.product.images && productData.product.images.length > 0) {
        if (!selectedImages.length) {
          const imageObjects = productData.product.images.map((image) => ({ id: image.id, preview: image.small }));
          setImages(imageObjects);
        }
      }

      if (setSelectedPhotos) {
        setSelectedPhotos(selectedImages);
      }
    }, [productData.product.images, selectedImages]);

    useEffect(() => {
      if (setUploadingPhotos) {
        setUploadingPhotos(uploading);
      }
    }, [uploadStatus]);

    const removeImageFromServer = async (id: string) => {
      try {
        await ManageProductApi.deleteProductImage(productData.product.id, id);
        setProductData((prevData) => ({
          ...prevData,
          product: {
            ...prevData.product,
            images: prevData.product.images.filter((img) => img.id !== id),
          },
        }));
      } catch (error) {
        showErrorNotification(tr.get('manageProduct.notification.ErrorDeletingImage'), error.message);
      }
    };

    const handleCoverImage = async (id: string) => {
      if (productData.product.cover === id) {
        return;
      }

      try {
        await ManageProductApi.setProductCoverImage(productData.product.id, id).then(({ cover }) => {
          setProductData((prevData) => ({
            ...prevData,
            product: {
              ...prevData.product,
              cover,
            },
          }));
        });
        showSuccessNotification(tr.get('manageProduct.notification.CoverImageSet'), {
          autoClose: 1000,
        });
      } catch (error) {
        showErrorNotification(tr.get('manageProduct.notification.ErrorSettingCoverImage'), error.message);
      }
    };

    useImperativeHandle(ref, () => ({
      uploadImages: async (isRedirect, customFunction?) => {
        await uploadImages(productData.product.id, selectedImages, isRedirect, customFunction);
      },
    }));

    return (
      <>
        <h2 className="form__title">{tr.get('manageProduct.tabsTitle.photos')}</h2>
        <form onSubmit={(event: FormEvent<HTMLFormElement>) => event.preventDefault()}>
          <AddImage
            uploading={uploading}
            uploadStatus={uploadStatus}
            onSelectFile={onSelectFile}
            deleteHandler={deleteHandler}
            selectedImages={selectedImages}
            disabled={uploading || !currentPlanData?.plan?.max_product_images}
            handleCoverImage={handleCoverImage}
            coverImageId={productData.product.cover}
            removeImageFromServer={removeImageFromServer}
            maxImages={currentPlanData?.plan?.max_product_images}
            placeholder={
              !currentPlanData?.plan?.max_product_images
                ? tr.get('manageProduct.ToEditAPhotoYouNeedToBuyAPlan')
                : `${tr.get('manageProduct.photos.placeholderFirst')} ${remainingImages} ${tr.get(
                    'manageProduct.photos.placeholderSecond',
                  )}`
            }
          />
        </form>
      </>
    );
  },
);

export default Photos;
