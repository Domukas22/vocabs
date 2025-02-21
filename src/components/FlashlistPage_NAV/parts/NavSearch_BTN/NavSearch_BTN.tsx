//
//
//

import Btn from "@/src/components/1_grouped/buttons/Btn/Btn";
import { ICON_search } from "@/src/components/1_grouped/icons/icons";

export function NavSearch_BTN({
  OPEN_search = () => {},
}: {
  OPEN_search: () => void;
}) {
  return (
    <Btn onPress={OPEN_search} iconLeft={<ICON_search />} style={{ flex: 1 }} />
  );
}
