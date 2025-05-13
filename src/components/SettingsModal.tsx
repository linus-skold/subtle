import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Label,
  Field,
} from '@headlessui/react';
import ToggleComponent from './ToggleComponent';
import { useAppContext } from '@/context/AppContext';
import { XCircleIcon } from '@heroicons/react/24/outline';

const SettingsModal = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: (v: boolean) => void;
}) => {
  const { state, updateAppSettings } = useAppContext();

  const appSettings = state.appSettings;

  const setAlwaysOnTop = (value: boolean) => {
    updateAppSettings({ ...appSettings, alwaysOnTop: value });
  };

  const setAutoStart = (value: boolean) => {
    updateAppSettings({ ...appSettings, autoStart: value });
  };

  return (
    <Dialog
      open={isOpen}
      as="div"
      className="fixed top-6 left-0 w-screen focus:outline-none flex min-h-full "
      onClose={() => onClick(false)}
    >
      <DialogPanel transition className="
        w-full max-w-full bg-white/5 p-6 backdrop-blur-2xl 
        duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0">
        <div className="flex justify-between">
          <DialogTitle as="h3" className="text-base/7 font-bold text-white">
            SETTINGS
          </DialogTitle>
          <XCircleIcon className="h-6 w-6 text-white text-gray-800 hover:text-gray-500 transition-colors" onClick={() => onClick(false)} />
        </div>

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

      </DialogPanel>
    </Dialog>
  );
};
export default SettingsModal;
