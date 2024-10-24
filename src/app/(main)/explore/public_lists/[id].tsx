//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useRouter, useLocalSearchParams } from "expo-router";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { useEffect, useMemo, useRef, useState } from "react";

import { List_MODEL, Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";

import {
  CreateList_MODAL,
  List_SKELETONS,
  EmptyFlatList_BOTTM,
  MyLists_FLATLIST,
  MyLists_HEADER,
  MyLists_SUBNAV,
} from "@/src/features/1_lists";

import { useTranslation } from "react-i18next";
import { USE_searchedLists } from "@/src/features/1_lists/hooks/USE_searchedLists/USE_searchedLists";
import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";
import RenameList_MODAL from "@/src/features/1_lists/components/RenameList_MODAL/RenameList_MODAL";

import React from "react";
import { useToast } from "react-native-toast-notifications";
import DeleteList_MODAL from "@/src/features/1_lists/components/DeleteList_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Lists_DB, Users_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";
import { USER_ID } from "@/src/constants/globalVars";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Header from "@/src/components/Header/Header";
import Btn from "@/src/components/Btn/Btn";
import VocabDifficulty_COUNTS from "@/src/features/1_lists/components/VocabDifficulty_COUNTS/VocabDifficulty_COUNTS";

import { MyColors } from "@/src/constants/MyColors";

import Transition_BTN from "@/src/components/Transition_BTN/Transition_BTN";
import { ICON_arrow, ICON_download } from "@/src/components/icons/icons";
import USE_supabaseVocabsOfAList from "@/src/features/2_vocabs/hooks/USE_supabaseVocabsOfAList";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import PublicVocab_BACK from "@/src/features/2_vocabs/components/Vocab/Components/PublicVocab_BACK/PublicVocab_BACK";
import Vocab from "@/src/features/2_vocabs/components/Vocab/Vocab";
import vocabs from "../../vocabs";
import SavePublicVocabToList_MODAL from "@/src/features/2_vocabs/components/Modal/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";
import USE_fetchOnePublicList from "@/src/features/2_vocabs/hooks/USE_fetchOnePublicList";
import PublicVocabs_SUBNAV from "@/src/components/PublicVocabs_SUBNAV";
import { VocabDisplaySettings_MODAL } from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/VocabDisplaySettings_MODAL";
import USE_zustand from "@/src/zustand";
import USE_langs_2 from "@/src/features/4_languages/hooks/USE_langs_2";
import USE_debounceSearch from "@/src/hooks/USE_debounceSearch/USE_debounceSearch";

export default function PublicListVocabs_PAGE() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams();
  const { z_vocabDisplay_SETTINGS } = USE_zustand();
  const toast = useToast();
  const router = useRouter();
  const { search, debouncedSearch, SET_search } = USE_debounceSearch();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "save" },
    { name: "displaySettings" },
  ]);

  const { list, IS_listFetching, listFetch_ERROR } = USE_fetchOnePublicList(
    typeof id === "string" ? id : ""
  );

  const {
    vocabs,
    ARE_vocabsFetching,
    fetchVocabs_ERROR,
    LOAD_more,
    IS_loadingMore,
    HAS_reachedEnd,
  } = USE_supabaseVocabsOfAList({
    search: debouncedSearch,
    list,
    z_vocabDisplay_SETTINGS,
    paginateBy: 3,
  });

  const collectedLangIds = useMemo(() => {
    // infinite loop occurs if not defined
    return list?.collected_lang_ids || [];
  }, [list?.collected_lang_ids]);

  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>();

  return (
    <Page_WRAP>
      <Header
        btnLeft={
          <Btn
            type="seethrough"
            iconLeft={<ICON_arrow direction="left" />}
            style={{ borderRadius: 100 }}
            onPress={() => router.back()}
          />
        }
        btnRight={
          <Btn
            type="seethrough"
            iconLeft={<ICON_download />}
            style={{ borderRadius: 100 }}
          />
        }
        title={list?.name || "..."}
      />
      <PublicVocabs_SUBNAV
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
        {...{ search, SET_search }}
      />

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
      {/* ---------------------- MODALS ---------------------- */}
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

      <VocabDisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        collectedLang_IDS={collectedLangIds}
        HAS_difficulties={false}
      />
    </Page_WRAP>
  );
}
