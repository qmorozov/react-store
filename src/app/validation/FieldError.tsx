import { useTranslations } from '../../translation/translation.context';

export function FieldError({
  errors,
  translateParameters,
}: {
  errors: any;
  translateParameters?: Record<string, string | number>;
}) {
  const tr = useTranslations();

  if (!errors) {
    return null;
  }

  if (Array.isArray(errors)) {
    errors = errors.find(Boolean);
  }

  const message = errors.message || errors.type || 'error.invalid-value';

  return <i className="field-error">{tr.get(message, translateParameters)}</i>;
}

export default FieldError;
