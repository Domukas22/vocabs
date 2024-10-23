//
//
//

import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the display object type for TypeScript
export type DisplaySettings_PROPS = {
  SHOW_description: boolean;
  SHOW_flags: boolean;
  SHOW_difficulty: boolean;
  frontTrLang_ID: string;
  sorting: "shuffle" | "difficulty" | "date";
  sortDirection: "ascending" | "descending";
  difficultyFilters: (1 | 2 | 3)[];
  langFilters: string[];
};

// Key for AsyncStorage
const DISPLAY_SETTINGS_KEY = "@displaySettings";

// Save the display settings to AsyncStorage
export const SAVE_displaySettings = async (settings: DisplaySettings) => {
  try {
    const jsonValue = JSON.stringify(settings);
    await AsyncStorage.setItem(DISPLAY_SETTINGS_KEY, jsonValue);
  } catch (e) {
    console.error("Error saving display settings:", e);
  }
};

// Load the display settings from AsyncStorage
export const GET_displaySettings = async (): Promise<DisplaySettings> => {
  try {
    const jsonValue = await AsyncStorage.getItem(DISPLAY_SETTINGS_KEY);
    // Define default settings here
    const defaultSettings: DisplaySettings = {
      SHOW_description: true,
      SHOW_flags: true,
      SHOW_difficulty: true,
      frontTrLang_ID: "en",
      sorting: "shuffle",
      sortDirection: "ascending",
      difficultyFilters: [],
      langFilters: [],
    };

    return jsonValue != null ? JSON.parse(jsonValue) : defaultSettings;
  } catch (e) {
    console.error("🔴 Error loading display settings: 🔴", e);
    // Return default settings in case of error
    return {
      SHOW_description: true,
      SHOW_flags: true,
      SHOW_difficulty: true,
      frontTrLang_ID: "en",
      sorting: "shuffle",
      sortDirection: "ascending",
      difficultyFilters: [],
      langFilters: [],
    };
  }
};

// Clear the display settings from AsyncStorage (if needed)
export const CLEAR_displaySettings = async () => {
  try {
    await AsyncStorage.removeItem(DISPLAY_SETTINGS_KEY);
  } catch (e) {
    console.error("🔴 Error clearing display settings: 🔴", e);
  }
};

// Set or update specific properties of the display settings
export const SET_localStorageDisplaySettings = async (
  updates: Partial<DisplaySettings>
) => {
  try {
    // Load existing settings or default settings
    const existingSettings = await GET_displaySettings();

    // Merge existing settings with updates
    const updatedSettings = {
      ...existingSettings, // Start with existing settings
      ...updates, // Finally merge the updates passed to the function
    };

    // Save the updated settings back to AsyncStorage
    await SAVE_displaySettings(updatedSettings);
  } catch (e) {
    console.error("🔴 Error setting local storage display settings: 🔴", e);
  }
};
