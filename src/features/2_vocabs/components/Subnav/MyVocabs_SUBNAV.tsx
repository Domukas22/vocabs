//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_displaySettings, ICON_X } from "@/src/components/icons/icons";
import SearchBar from "@/src/components/SearchBar/SearchBar";
import Subnav from "@/src/components/Subnav/Subnav";
import USE_zustand from "@/src/zustand";
import { useMemo } from "react";

export default function Vocabs_SUBNAV({
  search,
  SET_search,
  TOGGLE_displaySettings,
  onPlusIconPress,
}: {
  search: string;
  SET_search: (val: string) => void;
  TOGGLE_displaySettings: () => void;
  onPlusIconPress: () => void;
}) {
  const { z_vocabDisplay_SETTINGS } = USE_zustand();

  const active_COUNT = useMemo(
    () =>
      z_vocabDisplay_SETTINGS.difficultyFilters.length +
      z_vocabDisplay_SETTINGS.langFilters.length,
    [
      z_vocabDisplay_SETTINGS.difficultyFilters,
      z_vocabDisplay_SETTINGS.langFilters,
    ]
  );

  return (
    <Subnav>
      <SearchBar value={search} SET_value={SET_search} />
      <Btn
        type="simple"
        iconLeft={<ICON_displaySettings />}
        style={{ borderRadius: 100 }}
        onPress={TOGGLE_displaySettings}
        topRightIconCount={active_COUNT}
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
