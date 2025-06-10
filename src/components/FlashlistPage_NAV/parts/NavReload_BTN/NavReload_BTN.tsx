//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_reload } from "@/src/components/1_grouped/icons/icons";

export function NavReload_BTN({
  reload = () => {},
  IS_disabled = false,
}: {
  reload?: () => void;
  IS_disabled: boolean;
}) {
  return (
    <Btn
      onPress={reload}
      iconLeft={<ICON_reload color="gray" />}
      style={{ flex: 1 }}
      // stayPressed={IS_disabled}
      locked={IS_disabled}
    />
  );
}
