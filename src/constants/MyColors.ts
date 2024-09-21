/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const primitives = {
  white095: "rgba(255, 255, 255, 0.95)",
  white06: "rgba(255, 255, 255, 0.60)",
  white01: "rgba(255, 255, 255, 0.10)",
  white005: "rgba(255, 255, 255, 0.05)",
  transparent: "rgba(255, 255, 255, 0.00)",
  black: "rgba(0, 0, 0, 0.95)",
  dark_seethrough: "rgba(0, 0, 0, 0.75)",
  dark1: "#2d2d2d",
  dark2: "#353535",
  dark3: "#3c3c3c",
  dark4: "#505050",
  primary1: "#ff8a58",
  primary2: "#f97841",
  primary3: "#553c31",
  primary4: "#423631",
  grey1: "#6c6c6c",
  grey2: "#ababab",
  green1: "#affb6d",
  green2: "#405231",
  green3: "#2e3528",
  red1: "#ff9191",
  red2: "#6d3c3c",
  red3: "#412929",
  yellow1: "#e7d991",
  yellow2: "#726834",
  yellow3: "#4b472f",
};

export const MyColors = {
  // Border colors
  border_0: primitives.transparent,
  border_white_005: primitives.white005,
  border_white: primitives.white095,
  border_contrast: primitives.primary1,
  border_green: primitives.green1,
  border_difficulty_3: primitives.red1,
  border_difficulty_2: primitives.yellow1,
  border_difficulty_1: primitives.white095,
  border_red: primitives.red1,

  // Fill colors
  fill_bg: primitives.dark1,
  fill_bg_light: primitives.dark2,
  fill_bg_dark_seethrough: primitives.dark_seethrough,
  fill_green: primitives.green1,

  // Icon colors
  icon_primary: primitives.primary1,
  icon_gray: primitives.grey1,
  icon_gray_light: primitives.grey2,
  icon_green: primitives.green1,
  icon_difficulty_3: primitives.red1,
  icon_difficulty_2: primitives.yellow1,
  icon_difficulty_1: primitives.grey2,
  icon_white: primitives.white095,

  // Button colors
  btn_1: primitives.dark1,
  btn_2: primitives.dark2,
  btn_3: primitives.dark3,

  btn_action: primitives.primary1,
  btn_action_press: primitives.primary2,

  btn_active: primitives.primary4,
  btn_active_press: primitives.primary3,

  btn_delete: primitives.red3,
  btn_delete_press: primitives.red2,

  btn_green: primitives.green3,
  btn_green_press: primitives.green2,

  btn_difficulty_3: primitives.red3,
  btn_difficulty_3_press: primitives.red2,

  btn_difficulty_2: primitives.yellow3,
  btn_difficulty_2_press: primitives.yellow2,

  btn_difficulty_1: primitives.dark3,
  btn_difficulty_1_press: primitives.dark4,

  // Text colors
  text_difficulty_3: primitives.red1,
  text_difficulty_2: primitives.yellow1,
  text_difficulty_1: primitives.white095,

  text_green: primitives.green1,
  text_white: primitives.white095,
  text_white_06: primitives.white06,

  text_primary: primitives.primary1,
  text_black: primitives.black,
  text_delete: primitives.red1,
};
