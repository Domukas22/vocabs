//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_settings } from "@/src/components/1_grouped/icons/icons";

export function NavListSettings_BTN({
  OPEN_listSettings = () => {},
}: {
  OPEN_listSettings: () => void;
}) {
  return (
    <Btn
      onPress={OPEN_listSettings}
      iconLeft={<ICON_settings />}
      style={{ flex: 1 }}
    />
  );
}
