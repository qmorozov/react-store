import { useState } from 'react';
import { LoginDto } from '../../dto/login.dto';
import { LoginDtoValidator } from '../../dto/login.dto.validation';
import { useFormValidation } from '../../../app/validation/form-validation.hook.client';
import { useTranslations } from '../../../translation/translation.context';
import { AuthApi } from '../auth.api.client';
import Social from '../../../layouts/shared/Social';
import FormControl from '../../../layouts/shared/FormControl';

enum Field {
  email = 'email',
  password = 'password',
  agree = 'agree',
}

const LogIn = () => {
  const tr = useTranslations();
  const [showPassword, setShowPassword] = useState(false);
  const [isFormSending, setIsFormSending] = useState<boolean>(false);

  const { register, handleSubmit, errors, setError, reset } = useFormValidation(LoginDtoValidator);

  const redirectParam = new URLSearchParams(new URL(window.location.href).search).get('redirect');

  const submitLogin = async (loginDto: LoginDto) => {
    try {
      setIsFormSending(true);

      await AuthApi.login(loginDto);

      reset();

      if (redirectParam && typeof redirectParam === 'string' && redirectParam.startsWith('/')) {
        window.location.href = redirectParam;
      } else {
        window.location.href = '/';
      }
    } catch (error) {
      Object.keys(error.response.data.error).map((err) => {
        setError(err, { message: error.response.data.error[err].message });
      });

      setIsFormSending(false);
    }
  };

  return (
    <>
      <form
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(submitLogin)}
        className={`${isFormSending && '--sending'}`}
      >
        <FormControl placeholder={tr.get('auth.login.email')} error={errors(Field.email)}>
          <input type="email" {...register(Field.email)} autoFocus />
        </FormControl>

        <FormControl
          type="password"
          showPassword={showPassword}
          error={errors(Field.password)}
          placeholder={tr.get('auth.login.password')}
          clickShowPassword={() => setShowPassword(!showPassword)}
        >
          <input {...register(Field.password)} />
        </FormControl>

        <button className="btn --primary" type={'submit'}>
          <span>{tr.get('auth.login.signIn')}</span>
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
      <div className="log-in__social">
        <span>{tr.get('auth.login.logIn')}</span>
        <div>
          <Social title="google" link="/api/oauth/google" targetBlank={false} />
          {/*<Social title="twitter" />*/}
          <Social title="facebook" link="/api/oauth/facebook" targetBlank={false} />
        </div>
      </div>
    </>
  );
};

export default LogIn;
