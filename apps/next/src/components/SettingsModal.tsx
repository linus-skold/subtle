import { useAppContext } from "../context/AppContext";
import {
  Field,
  Label,
} from "@headlessui/react";

import { ToggleComponent } from '@/components'

const SettingsModal = () => {
  const { state, updateAppSettings } = useAppContext();

  const appSettings = state.appSettings;

  const setAlwaysOnTop = (value: boolean) => {
    updateAppSettings({ ...appSettings, alwaysOnTop: value });
  };

  const setAutoStart = (value: boolean) => {
    updateAppSettings({ ...appSettings, autoStart: value });
  };

  return (
    <>
   
        <div className="flex flex-col gap-2 border-t border-gray-700 pt-2 mt-2">
          <ToggleComponent
            text="Always on top"
            checked={appSettings?.alwaysOnTop}
            onChange={setAlwaysOnTop}
          />
          <ToggleComponent
            text="Auto start"
            checked={appSettings?.autoStart}
            onChange={setAutoStart}
          />
          <ToggleComponent
            text="Always on top"
            checked={appSettings?.alwaysOnTop}
            onChange={setAlwaysOnTop}
          />
          <hr />
          <h3>Idle Settings</h3>
          <Field className="flex items-center justify-between">
            <Label>Idle detection time</Label>
            <Label>Value</Label>
          </Field>
          <ToggleComponent
            text="Resume on activity"
            checked={appSettings?.alwaysOnTop}
            onChange={setAlwaysOnTop}
          />
        </div>
    </>

  );
};
export default SettingsModal;
