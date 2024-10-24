//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import {
  CreateMyVocab_MODAL,
  MyVocabs_HEADER,
  MyVocabs_SUBNAV,
  MyVocabs_FLATLIST,
  DeleteVocab_MODAL,
  USE_filteredVocabs,
  USE_searchedVocabs,
  PublicVocabs_HEADER,
} from "@/src/features/2_vocabs";
import { useRouter } from "expo-router";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import { tr_PROPS } from "@/src/db/props";
import React, { useEffect, useMemo, useState } from "react";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import ListSettings_MODAL from "@/src/features/1_lists/components/ListSettings_MODAL/ListSettings_MODAL";
import { USE_auth } from "@/src/context/Auth_CONTEXT";

import { useTranslation } from "react-i18next";

import { useToast } from "react-native-toast-notifications";

import SavePublicVocabToList_MODAL from "@/src/features/2_vocabs/components/Modal/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Btn from "@/src/components/Btn/Btn";
import { ICON_X } from "@/src/components/icons/icons";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import SwipeableExample from "@/src/components/SwipeableExample/SwipeableExample";
import MyVocab from "@/src/features/2_vocabs/components/Vocab/My_VOCAB/My_VOCAB";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { MyColors } from "@/src/constants/MyColors";
import Vocab_FRONT from "@/src/features/2_vocabs/components/Vocab/Components/Vocab_FRONT/Vocab_FRONT";
import { VocabBack_TRS } from "@/src/features/2_vocabs/components/Vocab/Components/VocabBack_TRS/VocabBack_TRS";
import VocabBottomText_WRAP from "@/src/features/2_vocabs/components/Vocab/Components/VocabBottomText_WRAP/VocabBottomText_WRAP";
import Vocab from "@/src/features/2_vocabs/components/Vocab/Vocab";
import PublicVocab_BACK from "@/src/features/2_vocabs/components/Vocab/Components/PublicVocab_BACK/PublicVocab_BACK";
import USE_collectPublicListLangs from "@/src/features/2_vocabs/hooks/USE_collectPublicListLangs";
import USE_zustand from "@/src/zustand";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";
import USE_supabaseVocabsOfAList from "@/src/features/2_vocabs/hooks/USE_supabaseVocabsOfAList";
import USE_supabasePublicVocabs from "@/src/hooks/USE_supabasePublicVocabs";
import { VocabDisplaySettings_MODAL } from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import PublicVocabs_SUBNAV from "@/src/components/PublicVocabs_SUBNAV";

export default function Explore_PAGE() {
  const { user } = USE_auth();
  const { t } = useTranslation();
  const toast = useToast();

  const { search, debouncedSearch, SET_search } = USE_debounceSearch();
  const { z_vocabDisplay_SETTINGS } = USE_zustand();
  const { collectedLang_IDS, ARE_langIdsCollecting, collectLangIds_ERROR } =
    USE_collectPublicListLangs();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
    { name: "save" },
  ]);

  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>();

  // const [vocabs, SET_vocabs] = useState<Vocab_MODEL[]>([]);
  // const { FETCH_publicVocabs, ARE_publicVocabsFetching, publicVocabs_ERROR } =
  //   USE_fetchPublicVocabs({ user_id: user?.id || "" });

  // const getVocabs = async () => {
  //   const vocabs = await FETCH_publicVocabs();
  //   if (vocabs?.success && vocabs.data) {
  //     SET_vocabs(vocabs.data);
  //   }
  // };

  // useEffect(() => {
  //   getVocabs();
  // }, []);

  const {
    vocabs,
    ARE_vocabsFetching,
    fetchVocabs_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
  } = USE_supabasePublicVocabs({
    search: debouncedSearch,
    z_vocabDisplay_SETTINGS,
    paginateBy: 5,
  });

  return (
    <Page_WRAP>
      <PublicVocabs_HEADER />
      <PublicVocabs_SUBNAV
        {...{ search, SET_search }}
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
      />

      {/* {vocabs &&
        vocabs.map((v) => <Styled_TEXT>{v.trs?.[0]?.text}</Styled_TEXT>)} */}

      <Styled_FLATLIST
        data={vocabs}
        renderItem={({ item }) => {
          // const [open, TOGGLE_open] = USE_toggle(false);

          return (
            <Vocab
              vocab={item}
              vocab_BACK={(TOGGLE_vocab: () => void) => (
                <PublicVocab_BACK
                  {...{ TOGGLE_vocab }}
                  SAVE_vocab={() => {
                    SET_targetVocab(item);
                    TOGGLE_modal("save");
                  }}
                  list={item?.list || undefined}
                />
              )}
              SHOW_list
            ></Vocab>
          );
        }}
        keyExtractor={(item) => "PublicVocab" + item.id}
        ListFooterComponent={
          !HAS_reachedEnd && !ARE_vocabsFetching ? (
            <Btn
              text={!IS_loadingMore ? "Load more" : ""}
              iconRight={
                IS_loadingMore ? <ActivityIndicator color="white" /> : null
              }
              onPress={LOAD_more}
            />
          ) : HAS_reachedEnd ? (
            <Styled_TEXT>The end</Styled_TEXT>
          ) : null
        }
      />

      <VocabDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        collectedLang_IDS={collectedLang_IDS}
        HAS_difficulties={false}
      />

      <SavePublicVocabToList_MODAL
        vocab={target_VOCAB}
        IS_open={modal_STATES.save}
        onSuccess={() => {
          TOGGLE_modal("save");
          toast.show(t("notifications.savedVocab"), {
            type: "green",
            duration: 3000,
          });
        }}
        TOGGLE_open={() => TOGGLE_modal("save")}
      />
    </Page_WRAP>
  );
}
