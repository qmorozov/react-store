import { useState } from 'react';
import FormControl from '../../layouts/shared/FormControl';
import FieldError from '../../app/validation/FieldError';
import Breadcrumbs from '../../layouts/shared/Breadcrumbs';
import { AuthApi } from './auth.api.client';
import { RenderClientPage } from '../../app/client/render-client-page';
import { useFormValidation } from '../../app/validation/form-validation.hook.client';
import { ResetPasswordDtoValidator } from '../dto/reset-password.dto.validation';
import { Translations } from '../../translation/translation.provider.client';
import { TranslationContext } from '../../translation/translation.context';

import './style/resetPassword.client.scss';
import { useNotification } from '../../admin/hooks/useNotification';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

enum Field {
  token = 'token',
  password = 'password',
  confirmPassword = 'confirmPassword',
}

(async () => {
  const translation = await Translations.load('reset', 'common', 'error');

  const tokenRegex = /\?token=([^&]+)/;
  const match = window.location.search.match(tokenRegex);

  if (!match) {
    return window.location.replace('/');
  }

  return RenderClientPage(() => {
    const breadcrumbs = [{ title: translation.get('reset.title') }];
    const { showSuccessNotification } = useNotification();

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const ResetPasswordValidator = Object.assign(
      {
        fields: { confirmPassword: ResetPasswordDtoValidator.fields.password },
        param: { confirmPassword: ResetPasswordDtoValidator.param.password },
        hasErrors: ResetPasswordDtoValidator.hasErrors,
        errors: ResetPasswordDtoValidator.errors,
      },
      ResetPasswordDtoValidator,
    );
    ResetPasswordValidator.fields.confirmPassword = ResetPasswordDtoValidator.fields.password;
    ResetPasswordValidator.param.confirmPassword = ResetPasswordDtoValidator.fields.password;

    const { register, errors, handleSubmit, getValues, setError } = useFormValidation(ResetPasswordValidator);

    const submitResetPassword = async (resetPassword) => {
      delete resetPassword.confirmPassword;

      try {
        const { data } = await AuthApi.resetPassword(resetPassword);

        if (data.status === 'ok') {
          showSuccessNotification('The password was successfully changed', {
            onClose: () => (window.location.href = '/auth'),
          });
        }
      } catch (error) {
        Object.keys(error.response.data.error).map((err) => {
          setError(err, { message: error.response.data.error[err].message });
        });

        window.location.href = '/auth';
      }
    };

    return (
      <TranslationContext.Provider value={translation}>
        <Breadcrumbs crumbs={breadcrumbs} />
        <section className="reset-password-container --small">
          <h1 className="reset-password__title">{translation.get('reset.title')}</h1>
          <form onSubmit={handleSubmit(submitResetPassword)} noValidate>
            <FormControl
              type="password"
              showPassword={showNewPassword}
              placeholder={translation.get('reset.newPassword')}
              clickShowPassword={() => setShowNewPassword(!showNewPassword)}
              error={errors(Field.password)}
            >
              <input {...register(Field.password)} type={showNewPassword ? 'text' : 'password'} />
            </FormControl>
            <FormControl
              type="password"
              placeholder={translation.get('reset.confirmNewPassword')}
              showPassword={showConfirmPassword}
              clickShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register(Field.confirmPassword, {
                  validate: {
                    same: (value) => {
                      const { password } = getValues();
                      return password === value || translation.get('error.same_password');
                    },
                  },
                })}
              />
            </FormControl>
            <div>
              <input type="hidden" value={match[1]} {...register(Field.token)} />
              <button className="btn --primary" type="submit">
                <span>{translation.get('reset.title')}</span>
                <i className="icon icon-middle-arrow" />
              </button>
              <FieldError errors={errors(Field.confirmPassword)} />
            </div>
          </form>
        </section>
        <ToastContainer />
      </TranslationContext.Provider>
    );
  });
})();
