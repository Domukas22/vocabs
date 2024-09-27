//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_displaySettings, ICON_X } from "@/src/components/icons/icons";
import SearchBar from "@/src/components/SearchBar/SearchBar";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Subnav from "@/src/components/Subnav/Subnav";
import { MyColors } from "@/src/constants/MyColors";
import { Text, View } from "react-native";

export default function MyVocabs_SUBNAV({
  search,
  SET_search,
  TOGGLE_displaySettings,
  HANDLE_vocabModal,
}) {
  return (
    <Subnav>
      <SearchBar value={search} SET_value={SET_search} />
      <Btn
        type="simple"
        iconLeft={<ICON_displaySettings />}
        style={{ borderRadius: 100 }}
        onPress={TOGGLE_displaySettings}
        topRightIconCount={0}
      />
      <Btn
        type="simple"
        iconLeft={<ICON_X big={true} color="primary" />}
        style={{ borderRadius: 100 }}
        onPress={() => HANDLE_vocabModal({ clear: true })}
      />
    </Subnav>
  );
}
