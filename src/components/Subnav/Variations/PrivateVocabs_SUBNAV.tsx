//
//
//

import { TranslationCreation_PROPS, Vocab_MODEL } from "@/src/db/models";
import Btn from "../../Basic/Btn/Btn";
import { ICON_displaySettings, ICON_X } from "../../Basic/icons/icons";
import SearchBar from "../../Compound/SearchBar/SearchBar";
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
}

export default function PrivateVocabs_SUBNAV({
  search,
  SET_search,
  TOGGLE_displaySettings,
  HANDLE_vocabModal,
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
      <Btn
        type="simple"
        iconLeft={<ICON_X big={true} color="primary" />}
        style={{ borderRadius: 100 }}
        onPress={() => HANDLE_vocabModal({ clear: true })}
      />
    </Subnav>
  );
}
