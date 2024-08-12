import { useTranslations } from '../../translation/translation.context';
import { FC, useEffect, useState } from 'react';
import { useFormValidation } from '../../app/validation/form-validation.hook.client';
import { updateUserDtoValidator } from '../../user/dto/UpdateUser.dto.validator';
import FormControl from '../../layouts/shared/FormControl';
import AddImage from '../../layouts/shared/AddImage';
import { useAddImage } from '../../layouts/shared/AddImage/useAddImage';
import { ProfileApi } from './profile.api.client';
import { useNotification } from '../../admin/hooks/useNotification';
import { ToastContainer } from 'react-toastify';

enum Field {
  Phone = 'phone',
  Email = 'email',
  LastName = 'lastName',
  FirstName = 'firstName',
  Description = 'description',
  NewPassword = 'newPassword',
  CurrentPassword = 'currentPassword',
}

interface IProfileForm {
  userData: any;
  setUserData: (userData: any) => void;
  setIsSending: (isSending: boolean) => void;
}

const ProfileForm: FC<IProfileForm> = ({ userData, setUserData, setIsSending }) => {
  const tr = useTranslations();
  const { selectedImages, onSelectFile, deleteHandler, setImages } = useAddImage(true, 1);

  const { showSuccessNotification, showErrorNotification } = useNotification();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const { register, handleSubmit, errors, setValue, setError } = useFormValidation(updateUserDtoValidator);

  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<any[]>([]);

  useEffect(() => {
    if (userData) {
      setValue(Field.Email, userData.email);
      setValue(Field.Phone, userData.phone);
      setValue(Field.LastName, userData.lastName);
      setValue(Field.FirstName, userData.firstName);
      setValue(Field.Description, userData.description);
      setImages(userData.image ? [{ id: 'logo', preview: userData.image }] : null);
    }
  }, [userData]);

  const handleRegistrationData = async ({
    phone,
    email,
    lastName,
    firstName,
    description,
    newPassword,
    currentPassword,
  }: Record<Field, string | null>) => {
    if (newPassword && !currentPassword) {
      setError(Field.CurrentPassword, {
        type: 'manual',
        message: tr.get('profile.currentPasswordIsRequired'),
      });
      return;
    }

    if (newPassword && currentPassword && newPassword === currentPassword) {
      setError(Field.NewPassword, {
        type: 'manual',
        message: tr.get('profile.newPasswordMismatch'),
      });
      return;
    }

    const profileData = {
      email: email ?? null,
      phone: phone ?? null,
      lastName: lastName ?? null,
      firstName: firstName ?? null,
      description: description ?? null,
      newPassword: newPassword ?? null,
      currentPassword: currentPassword ?? null,
    };

    try {
      await setIsSending(true);

      const newProfileData = await ProfileApi.editProfile(profileData);

      if (selectedImages[0] instanceof File && selectedImages[0].type.startsWith('image/')) {
        setUploading(true);
        setUploadStatus([{ uploaded: false }]);

        try {
          await ProfileApi.addProfileLogo(selectedImages[0]);
          setUploadStatus([{ uploaded: true }]);
        } catch (error) {
          showErrorNotification(error, null);
          setUploadStatus([{ uploaded: false }]);
        }

        setUploading(false);
      }

      showSuccessNotification(tr.get('profile.profileWasEditedSuccessfully'), {
        autoClose: 1300,
      });

      setTimeout(() => {
        setImages(null);
        setUploadStatus([]);
        setIsSending(false);
      }, 2100);

      setUserData(newProfileData.data);
    } catch (error) {
      setError(Field.CurrentPassword, {
        type: 'manual',
        message: tr.get(error.response.data.error.message),
      });

      setIsSending(false);
    }
  };

  const removeImageFromServer = async () => {
    try {
      await ProfileApi.removeProfileLogo();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleRegistrationData)} noValidate autoComplete="off">
      <div className="form-group__fields">
        <FormControl placeholder={tr.get('profile.firstName')} error={errors(Field.FirstName)}>
          <input {...register(Field.FirstName)} />
        </FormControl>

        <FormControl placeholder={tr.get('profile.lastName')} error={errors(Field.FirstName)}>
          <input {...register(Field.LastName)} />
        </FormControl>
      </div>

      <div className="form-group__fields">
        <FormControl placeholder={tr.get('profile.email')} error={errors(Field.Email)}>
          <input type="email" {...register(Field.Email)} />
        </FormControl>

        <FormControl placeholder={tr.get('profile.phone')} type="number" error={errors(Field.Phone)}>
          <input type="number" {...register(Field.Phone)} />
        </FormControl>
      </div>

      <FormControl placeholder={tr.get('profile.description')} error={errors(Field.Description)}>
        <textarea {...register(Field.Description)} />
      </FormControl>

      <div className="form-group__fields">
        <FormControl
          type="password"
          showPassword={showPassword}
          error={errors(Field.CurrentPassword)}
          placeholder={tr.get('profile.currentPassword')}
          clickShowPassword={() => setShowPassword(!showPassword)}
        >
          <input type="password" {...register(Field.CurrentPassword)} />
        </FormControl>

        <FormControl
          type="password"
          showPassword={showPassword}
          error={errors(Field.NewPassword)}
          placeholder={tr.get('profile.newPassword')}
          clickShowPassword={() => setShowPassword(!showPassword)}
        >
          <input type="password" {...register(Field.NewPassword)} />
        </FormControl>
      </div>

      <AddImage
        maxImages={1}
        disabled={uploading}
        uploading={uploading}
        showCoverButton={false}
        uploadStatus={uploadStatus}
        onSelectFile={onSelectFile}
        deleteHandler={deleteHandler}
        classes="profile__add-image"
        selectedImages={selectedImages}
        placeholder={tr.get('profile.addProfileLogo')}
        removeImageFromServer={removeImageFromServer}
      />

      <button className="btn --primary">{tr.get('profile.saveChanges')}</button>

      <ToastContainer />
    </form>
  );
};

export default ProfileForm;
