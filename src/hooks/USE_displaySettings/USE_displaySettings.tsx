import { useEffect, useState } from "react";
import {
  GET_displaySettings,
  SET_localStorageDisplaySettings,
} from "@/src/utils/DisplaySettings/DisplaySettings"; // Adjust the import path
import { _DisplaySettings_PROPS } from "@/src/utils/DisplaySettings/DisplaySettings";

export type UpdateDisplaySettings_PROPS = (
  updates: Partial<_DisplaySettings_PROPS>
) => Promise<void>;

// Define the return type for the custom hook
type UseDisplaySettingsResult = {
  display_SETTINGS: _DisplaySettings_PROPS | undefined;
  UPDATE_displaySettings: UpdateDisplaySettings_PROPS;
};

export const USE_displaySettings = (): UseDisplaySettingsResult => {
  const [display_SETTINGS, SET_displaySettings] = useState<
    _DisplaySettings_PROPS | undefined
  >(undefined);

  // Function to fetch and set display settings
  const fetchDisplaySettings = async () => {
    const settings = await GET_displaySettings();
    SET_displaySettings(settings);
  };

  // Load settings when the component mounts
  useEffect(() => {
    fetchDisplaySettings();
  }, []);

  // Function to update settings
  const UPDATE_displaySettings = async (
    updates: Partial<_DisplaySettings_PROPS>
  ) => {
    await SET_localStorageDisplaySettings(updates); // Update the settings
    fetchDisplaySettings(); // Fetch settings again to update state
  };

  return { display_SETTINGS, UPDATE_displaySettings };
};
