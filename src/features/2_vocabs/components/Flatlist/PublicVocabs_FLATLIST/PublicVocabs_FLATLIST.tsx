//
//
//

import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import { DisplaySettings_PROPS, Vocab_PROPS } from "@/src/db/props";

import { useTranslation } from "react-i18next";
import { Public_VOCAB } from "../../Vocab/Public_VOCAB/Public_VOCAB";
import React, { useEffect, useState } from "react";
import SwipeableExample from "@/src/components/SwipeableExample/SwipeableExample";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_zustand from "@/src/zustand";
import { withObservables } from "@nozbe/watermelondb/react";
import FETCH_vocabs, { VocabFilter_PROPS } from "../../../utils/FETCH_vocabs";
import { Translation_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { Vocabs_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";
import { EmptyFlatList_BOTTM, List_SKELETONS } from "@/src/features/1_lists";

function _PublicVocabs_FLATLIST({
  vocabs,
  highlightedVocab_ID,
  SHOW_bottomBtn,
  HANDLE_updateModal,
  PREPARE_vocabDelete,
  PREPARE_toSaveVocab,
}: {
  vocabs: Vocab_MODEL[];
  SHOW_bottomBtn: React.ReactNode;
  highlightedVocab_ID: string | undefined;
  HANDLE_updateModal: ({
    clear,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_PROPS;
  }) => void;
  PREPARE_vocabDelete?: (id: string) => {};
  PREPARE_toSaveVocab: ({
    vocab,
    trs,
  }: {
    vocab: Vocab_PROPS;
    trs: Translation_MODEL[];
  }) => void;
}) {
  const { t } = useTranslation();
  const { user } = USE_auth();
  const { z_publicDisplay_SETTINGS } = USE_zustand();
  const [loading, SET_loading] = useState(false);

  if (loading) return <List_SKELETONS />;

  if (vocabs && vocabs?.length > 0) {
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
                  displaySettings: z_publicDisplay_SETTINGS,
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
  if (!loading && vocabs?.length === 0) {
    return (
      <EmptyFlatList_BOTTM
        // emptyBox_TEXT={t("label.thisListIsEmpty")}
        emptyBox_TEXT={t("label.thisListIsEmpty")}
      />
    );
  }
}

const enhance = withObservables(
  ["search"],
  ({ search }: { search: string }) => ({
    // vocabs: Vocabs_DB.query(Q.where("list_id", list_id)),
    vocabs: FETCH_vocabs({
      is_public: true,
      sorting: "date",
      search,
      sortDirection: "descending",
    }),
  })
);

export const PublicVocabs_FLATLIST = enhance(_PublicVocabs_FLATLIST);
