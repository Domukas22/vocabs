//
//
//

import { TranslationCreation_PROPS, Vocab_MODEL } from "@/src/db/models";
import Btn from "../../Btn/Btn";
import { ICON_displaySettings, ICON_X } from "../../icons/icons";
import SearchBar from "../../SearchBar/SearchBar";
import Subnav from "../Subnav";

interface MyVocabsSubnav_PROPS {
  search: string;
  SET_search: (val: string) => void;
  TOGGLE_displaySettings: () => void;
  HANDLE_vocabModal: ({
    clear,
    vocab,
    translations,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
    translations?: TranslationCreation_PROPS[];
  }) => void;
  IS_admin: boolean;
}

export default function PublicVocabs_SUBNAV({
  search,
  SET_search,
  TOGGLE_displaySettings,
  HANDLE_vocabModal,
  IS_admin = false,
}: MyVocabsSubnav_PROPS) {
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
