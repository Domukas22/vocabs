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
  PublicVocab_MODEL,
  Vocab_MODEL,
  PublicVocabDisplaySettings_PROPS,
} from "@/src/db/models";
import { useTranslation } from "react-i18next";

import React from "react";
import { View } from "react-native";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Public_VOCAB from "../../Public_VOCAB";

export default function PublicVocabs_FLATLIST({
  vocabs,
  SHOW_bottomBtn,
  IS_admin,
  TOGGLE_vocabModal,
  HANDLE_vocabModal,
  displaySettings,
  PREPARE_toSaveVocab,
}: {
  vocabs: PublicVocab_MODEL[];
  SHOW_bottomBtn: boolean;
  IS_admin: boolean;
  TOGGLE_vocabModal: () => void;
  HANDLE_vocabModal: ({
    clear,
    vocab,
  }: {
    clear?: boolean;
    vocab: PublicVocab_MODEL;
  }) => void;
  displaySettings: PublicVocabDisplaySettings_PROPS;
  PREPARE_toSaveVocab: (vocab: PublicVocab_MODEL) => void;
}) {
  const { t } = useTranslation();
  return (
    <Styled_FLATLIST
      data={vocabs}
      renderItem={({ item }) => (
        <Public_VOCAB
          key={"PublicVocab" + item.id}
          vocab={item}
          {...{
            displaySettings,
            IS_admin,
            HANDLE_vocabModal,
            PREPARE_toSaveVocab,
          }}
        />
      )}
      keyExtractor={(item) => "Vocab" + item.id}
      // ListFooterComponent={
      //   SHOW_bottomBtn ? (
      //     <Btn
      //       text={t("btn.createVocab")}
      //       iconLeft={<ICON_X color="primary" />}
      //       type="seethrough_primary"
      //       onPress={TOGGLE_vocabModal}
      //     />
      //   ) : null
      // }
    />
  );
}
