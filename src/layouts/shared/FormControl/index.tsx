import {
  ChangeEvent,
  Children,
  cloneElement,
  FC,
  Fragment,
  isValidElement,
  JSXElementConstructor,
  KeyboardEvent,
  ReactElement,
  ReactNode,
  useState,
} from 'react';

import FieldError from '../../../app/validation/FieldError';

enum InputType {
  text = 'text',
  number = 'number',
  checkbox = 'checkbox',
  password = 'password',
}

type InputTypeString = keyof typeof InputType;

interface IFormControl {
  error?: any;
  icon?: ReactNode;
  classes?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: InputTypeString;
  showPassword?: boolean;
  inputPlaceholder?: string;
  isSuggestProduct?: boolean;
  translateParameters?: Record<string, string | number>;
  clickShowPassword?: () => void;
  placeholder?: string | ReactNode;
  children: ReactElement<any, string | JSXElementConstructor<any>> & { type: string };
}

const FormControl: FC<IFormControl> = ({
  type,
  icon,
  error,
  translateParameters,
  onClick,
  classes,
  disabled,
  children,
  clickShowPassword,
  placeholder,
  showPassword,
  inputPlaceholder,
  isSuggestProduct,
}) => {
  if (type !== 'password' && (clickShowPassword !== undefined || showPassword !== undefined)) {
    throw new Error(`Cannot pass "clickShowPassword" or "showPassword" props when "type" is "checkbox".`);
  }

  const hasInputChild = Children.toArray(children).some(
    (child) =>
      isValidElement(child) &&
      child.type === 'input' &&
      (child.props.type === 'checkbox' || child.props.type === 'textarea' || child.props.type === 'password'),
  );

  if (hasInputChild && inputPlaceholder) {
    throw new Error(`Cannot pass "inputPlaceholder" prop when "children" contains "checkbox" or "textarea" input.`);
  }

  if (type === 'password' && (clickShowPassword === undefined || showPassword === undefined)) {
    throw new Error(`When type is "password", "onClick" and "showPassword" props are required`);
  }

  if (children.type === 'textarea' && (inputPlaceholder || clickShowPassword || showPassword)) {
    throw new Error(
      `Cannot pass "inputPlaceholder", "clickShowPassword", or "showPassword" props when "children" is a "textarea" element.`,
    );
  }

  const getInputClassName = () => {
    switch (type) {
      case 'password':
        return '--password';
      case 'checkbox':
        return '--checkbox';
      default:
        return '--default';
    }
  };

  const [height, setHeight] = useState<string>('37px');

  const handleTextareaInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setHeight('18px');
    setHeight(`${Math.min(event.target.scrollHeight, 300)}px`);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (type === 'number' && event.key !== '.' && (event.key < '0' || event.key > '9')) {
      event.preventDefault();
    }
  };

  const renderCheckbox = () => (
    <Fragment>
      {placeholder && <p>{placeholder}</p>}
      {children}
      <span></span>
      {error && <FieldError errors={error} />}
    </Fragment>
  );

  const renderInput = () => (
    <Fragment>
      {placeholder && <p className="form-label__placeholder">{placeholder}:</p>}
      <div>
        {cloneElement(children, {
          disabled: disabled,
          type: type === 'password' ? (showPassword ? 'text' : 'password') : type,
          inputMode: type === 'number' ? 'numeric' : undefined,
          pattern: type === 'number' ? '[0-9]*' : undefined,
          onKeyPress: handleKeyPress,
        })}
        {icon ? icon : inputPlaceholder && <span className="form-label__input-placeholder">{inputPlaceholder}</span>}
        {clickShowPassword && (
          <li className={`icon icon-eye${showPassword ? '' : '-off'}`} onClick={clickShowPassword} />
        )}
      </div>
      {error && <FieldError errors={error} translateParameters={translateParameters} />}
    </Fragment>
  );

  const renderTextarea = () => (
    <Fragment>
      {placeholder && <p className="form-label__placeholder">{placeholder}:</p>}
      {cloneElement(children as ReactElement<any>, {
        style: { height },
        onInput: handleTextareaInput,
      })}
      {error && <FieldError errors={error} />}
    </Fragment>
  );

  return (
    <label
      onClick={onClick}
      title={`${type === 'checkbox' ? 'Select' : 'Input'} "${
        typeof placeholder === 'string' ? placeholder : 'this field'
      }"`}
      className={`form-label ${children.type === 'textarea' ? '--textarea' : getInputClassName()} ${classes || ''} ${
        error ? '--error' : ''
      } ${isSuggestProduct ? '--suggest-product' : ''} ${disabled ? '--disabled' : ''} ${icon ? '--icon' : ''}`}
    >
      {type === 'checkbox' ? renderCheckbox() : children.type === 'textarea' ? renderTextarea() : renderInput()}
    </label>
  );
};

export default FormControl;
