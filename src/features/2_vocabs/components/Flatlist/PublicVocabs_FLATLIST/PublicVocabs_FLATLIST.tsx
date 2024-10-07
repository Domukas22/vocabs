//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import {
  MyVocabDisplaySettings_PROPS,
  PublicVocabDisplaySettings_PROPS,
  Vocab_MODEL,
} from "@/src/db/models";
import { useTranslation } from "react-i18next";
import Public_VOCAB from "../../Vocab/Public_VOCAB/Public_VOCAB";
import React from "react";
import SwipeableExample from "@/src/components/SwipeableExample/SwipeableExample";
import { USE_auth } from "@/src/context/Auth_CONTEXT";

export default function PublicVocabs_FLATLIST({
  vocabs,
  highlightedVocab_ID,
  SHOW_bottomBtn,
  HANDLE_updateModal,
  displaySettings,
  PREPARE_vocabDelete,
  PREPARE_toSaveVocab,
}: {
  vocabs: Vocab_MODEL[];
  SHOW_bottomBtn: React.ReactNode;
  highlightedVocab_ID: string | undefined;
  HANDLE_updateModal: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  };
  displaySettings: PublicVocabDisplaySettings_PROPS;
  PREPARE_vocabDelete?: (id: string) => {};
  PREPARE_toSaveVocab: (vocab: Vocab_MODEL) => void;
}) {
  const { t } = useTranslation();
  const { user } = USE_auth();

  return (
    <Styled_FLATLIST
      data={vocabs}
      renderItem={({ item }) => {
        return (
          <SwipeableExample
            rightBtn_ACTION={() => {
              if (PREPARE_vocabDelete) PREPARE_vocabDelete(item.id);
            }}
          >
            <Public_VOCAB
              vocab={item}
              IS_admin={user?.is_admin}
              highlighted={highlightedVocab_ID === item.id}
              {...{
                HANDLE_updateModal,
                user,
                displaySettings,
                PREPARE_toSaveVocab,
              }}
            />
          </SwipeableExample>
        );
      }}
      keyExtractor={(item) => "Vocab" + item.id}
      ListFooterComponent={
        SHOW_bottomBtn ? (
          <></>
        ) : // <Btn
        //   text={t("btn.createVocab")}
        //   iconLeft={<ICON_X color="primary" />}
        //   type="seethrough_primary"
        //   onPress={TOGGLE_createVocabModal}
        // />
        null
      }
    />
  );
}
