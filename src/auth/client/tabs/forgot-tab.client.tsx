import { FC, useState } from 'react';
import { ForgotDtoValidator } from '../../dto/forgot.dto.validation';
import { useFormValidation } from '../../../app/validation/form-validation.hook.client';
import FormControl from '../../../layouts/shared/FormControl';
import { AuthApi } from '../auth.api.client';
import { ForgotDto } from '../../dto/forgot.dto';
import { useTranslations } from '../../../translation/translation.context';

enum Field {
  email = 'email',
}

const ForgotPassword: FC = () => {
  const tr = useTranslations();
  const [email, setEmail] = useState<string>('');
  const [isFormSending, setIsFormSending] = useState<boolean>(false);
  const [isForgotComplete, setIsForgotComplete] = useState<boolean>(false);
  const { register, handleSubmit, errors, setError, reset } = useFormValidation(ForgotDtoValidator);

  const submitForgotPassword = async (forgotDto: ForgotDto) => {
    try {
      setIsFormSending(true);

      const forgotPasswordResponse = await AuthApi.forgotPassword(forgotDto);

      reset();

      if (forgotPasswordResponse.data) {
        setEmail(forgotDto.email.replace(/^(.{3})(.+)(@.+\..+)$/, '$1*****$3'));
      }

      setIsForgotComplete(true);
    } catch (error) {
      Object.keys(error.response.data.error).map((err) => {
        setError(err, { message: error.response.data.error[err].message });
      });

      setIsFormSending(false);
      setIsForgotComplete(false);
    }
  };

  const authContainer: HTMLElement = document.querySelector('.auth-container');
  const linkToMainPage: string = tr.link('/');

  if (authContainer && isForgotComplete) {
    const newContent = `
    <div class="auth-info">
      <h2 class="auth-info__title">${email ? tr.get(`auth.forgot.emailSent`) : tr.get('auth.somethingWentWrong')}</h2>
      ${email ? `<p>${tr.get(`auth.forgot.emailSentDescription`)} <b>${email}</b>.</p>` : ''}
      <a class="btn --primary" href="${linkToMainPage}">Oк</a>
    </div>
  `;

    authContainer.innerHTML = newContent;
  }

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(submitForgotPassword)}
      className={`${isFormSending && '--sending'}`}
    >
      <FormControl placeholder={tr.get('auth.forgot.email')} error={errors(Field.email)}>
        <input type="email" {...register(Field.email)} autoFocus />
      </FormControl>

      <button className="btn --primary" type={'submit'}>
        <span>{tr.get('auth.forgot.restorePassword')}</span>
        <i className="icon icon-middle-arrow" />
      </button>
    </form>
  );
};

export default ForgotPassword;
