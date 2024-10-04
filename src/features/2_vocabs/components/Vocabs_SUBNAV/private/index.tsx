//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_displaySettings, ICON_X } from "@/src/components/icons/icons";
import SearchBar from "@/src/components/SearchBar/SearchBar";
import Subnav from "@/src/components/Subnav/Subnav";

export default function Vocabs_SUBNAV({
  search,
  activeFitlers = 0,
  SET_search,
  TOGGLE_displaySettings,
  onPlusIconPress,
}: {
  search: string;
  activeFitlers: number;
  SET_search: (val: string) => void;
  TOGGLE_displaySettings: () => void;
  onPlusIconPress: () => void;
}) {
  return (
    <Subnav>
      <SearchBar value={search} SET_value={SET_search} />
      <Btn
        type="simple"
        iconLeft={<ICON_displaySettings />}
        style={{ borderRadius: 100 }}
        onPress={TOGGLE_displaySettings}
        topRightIconCount={activeFitlers}
      />
      <Btn
        type="simple"
        iconLeft={<ICON_X big={true} color="primary" />}
        style={{ borderRadius: 100 }}
        onPress={onPlusIconPress}
      />
    </Subnav>
  );
}
