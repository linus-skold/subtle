import { Switch, Field, Label } from '@headlessui/react';

const ToggleComponent = ({text, checked, onChange }: {text: string, checked: boolean, onChange: (checked: boolean) => void}) => {
  return (
    <Field className="flex items-center justify-between">
      <Label className="text-gray-400">{text}</Label>
      <Switch className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-800 transition data-checked:bg-blue-600" checked={checked} onChange={onChange}>
        <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
      </Switch>
    </Field>
  );
};

export default ToggleComponent;