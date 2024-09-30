//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_displaySettings, ICON_X } from "@/src/components/icons/icons";
import SearchBar from "@/src/components/SearchBar/SearchBar";
import Subnav from "@/src/components/Subnav/Subnav";

export default function PublicVocabs_SUBNAV({
  search,
  SET_search,
  TOGGLE_displaySettings,
  HANDLE_vocabModal,
  IS_admin = false,
}) {
  return (
    <Subnav>
      <SearchBar value={search} SET_value={SET_search} />
      <Btn
        type="simple"
        iconLeft={<ICON_displaySettings />}
        style={{ borderRadius: 100 }}
        onPress={TOGGLE_displaySettings}
      />
      {IS_admin && (
        <Btn
          type="simple"
          iconLeft={<ICON_X big={true} color="admin" />}
          style={{ borderRadius: 100 }}
          onPress={() => HANDLE_vocabModal({ clear: true })}
        />
      )}
    </Subnav>
  );
}
