import { FC, useEffect, useState } from 'react';
import { useTranslations } from '../../../../translation/translation.context';
import { useFormValidation } from '../../../../app/validation/form-validation.hook.client';
import { ShopApi } from '../../shop.api.client';
import { IShopData } from '../../manageShop.client';
import { useAddImage } from '../../../../layouts/shared/AddImage/useAddImage';
import { ManageShopDTOValidator } from '../../../dto/validation/AddShop.dto.validation';
import { ShopDTO } from '../../../dto/addShop.dto';
import { useNotification } from '../../../../admin/hooks/useNotification';
import FormControl from '../../../../layouts/shared/FormControl';
import AddImage from '../../../../layouts/shared/AddImage';

enum Field {
  Name = 'name',
  Description = 'description',
  FormOfOrganization = 'formOfOrganization',
  VatNumber = 'vatNumber',
  Country = 'country',
  City = 'city',
  ZipCode = 'zipCode',
  PhoneNumber = 'phoneNumber',
}

interface IManageShopForm {
  shopData: IShopData;
  isChangeInfo: boolean;
  setShopData: (shopData) => void;
  setIsSending: (isSending: boolean) => void;
}

const ManageShopForm: FC<IManageShopForm> = ({ shopData, setShopData, isChangeInfo, setIsSending }) => {
  const tr = useTranslations();
  const { showErrorNotification, showSuccessNotification } = useNotification();
  const { register, handleSubmit, errors, setValue } = useFormValidation(ManageShopDTOValidator);

  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<any[]>([]);

  const { selectedImages, onSelectFile, deleteHandler, setImages } = useAddImage(true, 1);

  useEffect(() => {
    if (shopData) {
      setValue(Field.Name, shopData.name);
      setValue(Field.Description, shopData.description);
      setValue(Field.FormOfOrganization, shopData.formOfOrganization);
      setValue(Field.VatNumber, shopData.vatNumber);
      setValue(Field.Country, shopData.country);
      setValue(Field.City, shopData.city);
      setValue(Field.ZipCode, shopData.zipCode);
      setValue(Field.PhoneNumber, shopData.phoneNumber);
      setImages(shopData.image ? [{ id: 'logo', preview: shopData.image }] : null);
    }
  }, [shopData]);

  const handleManageShopInfo = async (manageShopInfo: ShopDTO) => {
    if (shopData) {
      await setIsSending(true);

      try {
        await ShopApi.editShop(shopData.uuid, manageShopInfo);

        if (selectedImages[0] instanceof File && selectedImages[0].type.startsWith('image/')) {
          setUploading(true);
          setUploadStatus([{ uploaded: false }]);

          try {
            await ShopApi.addShopLogo(shopData.uuid, selectedImages[0]);
            setUploadStatus([{ uploaded: true }]);

            showSuccessNotification(tr.get('manageShop.updatedShopSuccess'), {
              autoClose: 1300,
            });

            setTimeout(() => {
              setImages(null);
              setUploadStatus([]);
              setIsSending(false);

              window.location.reload();
            }, 2100);
          } catch (error) {
            showErrorNotification(tr.get('manageShop.errorEdit'), error.message);
            setUploadStatus([{ uploaded: false }]);
          }

          setUploading(false);
        } else {
          showSuccessNotification(tr.get('manageShop.updatedShopSuccess'), {
            autoClose: 1300,
          });

          setTimeout(() => {
            setImages(null);
            setUploadStatus([]);
            setIsSending(false);

            window.location.reload();
          }, 2100);
        }
      } catch (error) {
        showErrorNotification(tr.get('manageShop.errorEdit'), error.message);
        setIsSending(false);
      }
    } else {
      try {
        await setIsSending(true);

        const shopInfo = await ShopApi.addShop(manageShopInfo);

        await setShopData((prevState) => ({
          ...prevState,
          ...shopInfo,
        }));

        showSuccessNotification(tr.get('manageShop.createdShopSuccess'), null);

        setIsSending(false);

        window.location.reload();
      } catch (error) {
        showErrorNotification(tr.get('manageShop.errorAdd'), error.message);
        setIsSending(false);
      }
    }
  };

  const removeImageFromServer = async () => {
    try {
      await ShopApi.deleteLogo(shopData.uuid);
    } catch (error) {
      showErrorNotification(tr.get('manageShop.ErrorDeletingImage'), error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleManageShopInfo)} noValidate autoComplete="off">
      <FormControl placeholder={tr.get('manageShop.name')} error={errors(Field.Name)} translateParameters={{ min: 3 }}>
        <input {...register(Field.Name)} />
      </FormControl>

      <FormControl placeholder={tr.get('manageShop.description')} error={errors(Field.Description)}>
        <textarea {...register(Field.Description)} />
      </FormControl>

      <FormControl placeholder={tr.get('manageShop.formOfOrganization')} error={errors(Field.FormOfOrganization)}>
        <input {...register(Field.FormOfOrganization)} />
      </FormControl>

      <FormControl
        placeholder={tr.get('manageShop.vatNumber')}
        error={errors(Field.VatNumber)}
        translateParameters={{ min: 3 }}
      >
        <input {...register(Field.VatNumber)} />
      </FormControl>

      <div className="form-group__fields">
        <FormControl
          placeholder={tr.get('manageShop.country')}
          error={errors(Field.Country)}
          translateParameters={{ min: 3 }}
        >
          <input {...register(Field.Country)} />
        </FormControl>

        <FormControl
          placeholder={tr.get('manageShop.city')}
          error={errors(Field.City)}
          translateParameters={{ min: 3 }}
        >
          <input {...register(Field.City)} />
        </FormControl>
      </div>

      <div className="form-group__fields">
        <FormControl
          type="number"
          placeholder={tr.get('manageShop.phoneNumber')}
          error={errors(Field.PhoneNumber)}
          translateParameters={{ min: 3 }}
        >
          <input type="number" {...register(Field.PhoneNumber)} />
        </FormControl>

        <FormControl
          type="number"
          placeholder={tr.get('manageShop.zipCode')}
          error={errors(Field.ZipCode)}
          translateParameters={{ min: 3 }}
        >
          <input type="number" {...register(Field.ZipCode)} />
        </FormControl>
      </div>

      {isChangeInfo && (
        <AddImage
          maxImages={1}
          disabled={uploading}
          uploading={uploading}
          showCoverButton={false}
          uploadStatus={uploadStatus}
          onSelectFile={onSelectFile}
          deleteHandler={deleteHandler}
          selectedImages={selectedImages}
          placeholder={tr.get('manageShop.addPhotos')}
          removeImageFromServer={removeImageFromServer}
        />
      )}

      <button className="btn --primary" type="submit">
        {tr.get(`manageShop.${!isChangeInfo ? 'addShop' : 'editShop'}`)}
        <i className="icon icon-middle-arrow" />
      </button>
    </form>
  );
};

export default ManageShopForm;
