//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import MyList_BTN from "@/src/features/1_lists/components/MyList_BTN/MyList_BTN";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import {
  MyVocabDisplaySettings_PROPS,
  List_MODEL,
  Vocab_MODEL,
} from "@/src/db/models";
import { useTranslation } from "react-i18next";
import Vocab from "../../Vocab";
import React from "react";

export default function Vocabs_FLATLIST({
  vocabs,
  highlightedVocab_ID,
  SHOW_bottomBtn,
  TOGGLE_vocabModal,
  HANDLE_vocabModal,
  displaySettings,
}: {
  vocabs: Vocab_MODEL[];
  SHOW_bottomBtn: React.ReactNode;
  TOGGLE_vocabModal: () => void;
  highlightedVocab_ID: string;
  HANDLE_vocabModal: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  };
  displaySettings: MyVocabDisplaySettings_PROPS;
}) {
  const { t } = useTranslation();
  return (
    <Styled_FLATLIST
      data={vocabs}
      renderItem={({ item }) => (
        <Vocab
          vocab={item}
          highlighted={highlightedVocab_ID === item.id}
          displaySettings={displaySettings}
          HANDLE_vocabModal={HANDLE_vocabModal}
        />
      )}
      keyExtractor={(item) => "Vocab" + item.id}
      ListFooterComponent={
        SHOW_bottomBtn ? (
          <Btn
            text={t("btn.createVocab")}
            iconLeft={<ICON_X color="primary" />}
            type="seethrough_primary"
            onPress={TOGGLE_vocabModal}
          />
        ) : null
      }
    />
  );
}
