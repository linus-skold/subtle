import React from "react";

import { useAppContext } from "../context/AppContext";

import { ToggleComponent } from "@/components";

const SettingsModal = () => {
  const { appService, setSettings, settings, getSetting } = useAppContext();

  const setSetting = (id: number, key: string, value: string) => {
    const setting = getSetting(key);
    if (setting) {
      appService
        .updateSettings({ id, setting: key, state: value })
        .then(() => {
          console.log(`Setting ${key} updated to ${value}`);
          setSettings((prevSettings) =>
            prevSettings?.map((s) =>
              s.setting === key ? { ...s, state: value } : s,
            ),
          );
        })
        .catch((error: unknown) => {
          console.error(`Failed to update setting ${key}:`, error);
        });
    } else {
      console.warn(`Setting ${key} not found`);
    }
  };

  return (
    <div className="flex flex-col gap-2 border-gray-700 pt-2 mt-2">
      {settings?.map((setting) => (
        <ToggleComponent
          text={setting.setting}
          checked={setting.state === "true"}
          key={setting.setting}
          onChange={() =>
            setSetting(
              setting.id,
              setting.setting,
              setting.state === "true" ? "false" : "true",
            )
          }
        />
      ))}
    </div>
  );
};
export default SettingsModal;
