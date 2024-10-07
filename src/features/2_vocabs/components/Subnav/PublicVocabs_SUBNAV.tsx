//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_displaySettings, ICON_X } from "@/src/components/icons/icons";
import SearchBar from "@/src/components/SearchBar/SearchBar";
import Subnav from "@/src/components/Subnav/Subnav";

interface PublicVocabsSubnav_PROPS {
  search: string;
  SET_search: (val: string) => void;
  TOGGLE_displaySettings: () => void;
  TOGGLE_createPublicVocabModal: () => void;
  is_admin: boolean;
}

export default function PublicVocabs_SUBNAV({
  search,
  SET_search,
  TOGGLE_displaySettings,
  TOGGLE_createPublicVocabModal,
  is_admin = false,
}: PublicVocabsSubnav_PROPS) {
  return (
    <Subnav>
      <SearchBar value={search} SET_value={SET_search} />
      <Btn
        type="simple"
        iconLeft={<ICON_displaySettings />}
        style={{ borderRadius: 100 }}
        onPress={TOGGLE_displaySettings}
      />
      {is_admin && (
        <Btn
          type="simple"
          iconLeft={<ICON_X big={true} color="admin" />}
          style={{ borderRadius: 100 }}
          onPress={TOGGLE_createPublicVocabModal}
        />
      )}
    </Subnav>
  );
}
