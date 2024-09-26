//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import MyList_BTN from "@/src/features/1_lists/components/MyList_BTN/MyList_BTN";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { List_MODEL, Vocab_MODEL } from "@/src/db/models";
import { useTranslation } from "react-i18next";
import My_VOCAB from "../../My_VOCAB";
import React from "react";

export default function MyVocabs_FLATLIST({
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
}) {
  const { t } = useTranslation();
  return (
    <Styled_FLATLIST
      data={vocabs}
      renderItem={({ item }) => (
        <My_VOCAB
          key={"Vocab" + item.id}
          vocab={item}
          displaySettings={displaySettings}
          HANDLE_vocabModal={HANDLE_vocabModal}
          highlightedVocab_ID={highlightedVocab_ID}
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
