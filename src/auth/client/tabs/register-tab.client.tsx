import { FC, useState } from 'react';
import { useFormValidation } from '../../../app/validation/form-validation.hook.client';
import { RegisterDtoValidator } from '../../dto/register.dto.validation';
import FormControl from '../../../layouts/shared/FormControl';
import { AuthApi } from '../auth.api.client';
import { RegisterDto } from '../../dto/register.dto';
import { useTranslations } from '../../../translation/translation.context';

enum Field {
  firstName = 'firstName',
  lastName = 'lastName',
  email = 'email',
  password = 'password',
  confirmPassword = 'confirmPassword',
  agree = 'agree',
}

const Registration: FC = () => {
  const tr = useTranslations();
  const [email, setEmail] = useState<string>('');
  const [isFormSending, setIsFormSending] = useState<boolean>(false);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState(false);
  const RegisterValidator = Object.assign(
    {
      fields: { confirmPassword: RegisterDtoValidator.fields.password },
      param: { confirmPassword: RegisterDtoValidator.param.password },
      hasErrors: RegisterDtoValidator.hasErrors,
      errors: RegisterDtoValidator.errors,
    },
    RegisterDtoValidator,
  );
  RegisterValidator.fields.confirmPassword = RegisterDtoValidator.fields.password;
  RegisterValidator.param.confirmPassword = RegisterDtoValidator.fields.password;

  const { register, handleSubmit, errors, getValues, setError, reset } = useFormValidation(RegisterValidator);

  const submitRegistration = async (registerDto: RegisterDto) => {
    try {
      setIsFormSending(true);
      const registerResponse = await AuthApi.registration(registerDto);

      reset();

      if (registerResponse.data) {
        setEmail(registerDto.email.replace(/^(.{3})(.+)(@.+\..+)$/, '$1*****$3'));
      }

      setIsRegistrationComplete(true);
    } catch (error) {
      Object.keys(error.response.data.error).map((err) => {
        setError(err, { message: error.response.data.error[err].message });
      });

      setIsFormSending(false);
      setIsRegistrationComplete(false);
    }
  };

  const authContainer: HTMLElement = document.querySelector('.auth-container');
  const linkToMainPage: string = tr.link('/');

  if (authContainer && isRegistrationComplete) {
    const newContent = `
    <div class="auth-info">
      <h2 class="auth-info__title">${email ? tr.get(`auth.register.emailSent`) : tr.get('auth.somethingWentWrong')}</h2>
      ${email ? `<p>${tr.get(`auth.register.emailSentDescription`)} <b>${email}</b>.</p>` : ''}
      <a class="btn --primary" href="${linkToMainPage}">Oк</a>
    </div>
  `;

    authContainer.innerHTML = newContent;
  }

  return (
    <form
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(submitRegistration)}
      className={`${isFormSending && '--sending'}`}
    >
      <FormControl placeholder={tr.get('auth.register.firstName')} error={errors(Field.firstName)}>
        <input {...register(Field.firstName)} autoFocus />
      </FormControl>

      <FormControl placeholder={tr.get('auth.register.lastName')} error={errors(Field.lastName)}>
        <input {...register(Field.lastName)} />
      </FormControl>

      <FormControl placeholder={tr.get('auth.register.email')} error={errors(Field.email)}>
        <input type="email" {...register(Field.email)} />
      </FormControl>

      <FormControl
        type="password"
        showPassword={showPassword}
        error={errors(Field.password)}
        placeholder={tr.get('auth.register.password')}
        clickShowPassword={() => setShowPassword(!showPassword)}
      >
        <input type={showPassword ? 'text' : 'password'} {...register(Field.password)} />
      </FormControl>

      <FormControl
        type={'password'}
        showPassword={showPassword}
        error={errors(Field.confirmPassword)}
        clickShowPassword={() => setShowPassword(!showPassword)}
        placeholder={tr.get('auth.register.confirmPassword')}
      >
        <input
          type={showPassword ? 'text' : 'password'}
          {...register(Field.confirmPassword, {
            validate: {
              same: (value) => {
                const { password } = getValues();
                return password === value || tr.get('error.same_password');
              },
            },
          })}
        />
      </FormControl>

      <button className="btn --primary" type="submit">
        <span>{tr.get('auth.register.signUp')}</span>
        <i className="icon icon-middle-arrow" />
      </button>

      <FormControl
        type="checkbox"
        error={errors(Field.agree)}
        classes={!!errors(Field.agree) && 'field-error-wrapper'}
        placeholder={
          <>
            <>{tr.get('auth.agreeText.startTextAgree')} </>
            <a>{tr.get('auth.agreeText.processingAgreement')}</a>
          </>
        }
      >
        <input type="checkbox" defaultChecked {...register(Field.agree)} />
      </FormControl>
    </form>
  );
};

export default Registration;
