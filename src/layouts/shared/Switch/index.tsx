import { FC, memo, useState } from 'react';
import { Switch } from '@headlessui/react';

interface ICustomSwitch {
  label: string;
  classes?: string;
  defaultEnabled?: boolean;
  onChange?: (enabled: boolean) => void;
}

const CustomSwitch: FC<ICustomSwitch> = memo(({ defaultEnabled, onChange, label, classes }) => {
  const [enabled, setEnabled] = useState<boolean>(defaultEnabled || false);

  const handleChange = (enabled: boolean) => {
    setEnabled(enabled);
    if (onChange) {
      onChange(enabled);
    }
  };

  return (
    <label className={`switch-wrapper ${classes ?? classes}`}>
      <span>{label}:</span>
      <Switch checked={enabled} onChange={handleChange} className={`switch ${enabled ? '--checked' : ''}`}>
        <span className={`switch-thumb ${enabled ? '--checked' : ''}`} />
      </Switch>
    </label>
  );
});

export default CustomSwitch;
