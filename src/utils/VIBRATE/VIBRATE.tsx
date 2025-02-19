//
//
//

import * as Haptics from "expo-haptics";

export function VIBRATE(type: "soft" | "light" = "soft") {
  switch (type) {
    case "soft":
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      break;
    case "light":
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    default:
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  }
}
