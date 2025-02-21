//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_displaySettings } from "@/src/components/1_grouped/icons/icons";

export function NavDisplaySettings_BTN({
  OPEN_displaySettings = () => {},
  activeFilter_COUNT = 0,
}: {
  OPEN_displaySettings: () => void;
  activeFilter_COUNT: number;
}) {
  return (
    <Btn
      onPress={OPEN_displaySettings}
      iconLeft={<ICON_displaySettings />}
      style={{ flex: 1 }}
      topRightIconCount={activeFilter_COUNT}
    />
  );
}
