//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_X } from "@/src/components/1_grouped/icons/icons";

export function NavCreate_BTN({
  OPEN_createModal = () => {},
}: {
  OPEN_createModal: () => void;
}) {
  return (
    <Btn
      type="simple_primary_text"
      onPress={OPEN_createModal}
      iconLeft={<ICON_X color="primary" big />}
      style={{ flex: 1 }}
    />
  );
}
