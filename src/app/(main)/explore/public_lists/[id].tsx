//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import { useRouter, useLocalSearchParams } from "expo-router";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import { useEffect, useRef, useState } from "react";

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
import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { Lists_DB, Users_DB } from "@/src/db";
import { Q } from "@nozbe/watermelondb";
import { USER_ID } from "@/src/constants/globalVars";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import Header from "@/src/components/Header/Header";
import Btn from "@/src/components/Btn/Btn";
import VocabDifficulty_COUNTS from "@/src/features/1_lists/components/VocabDifficulty_COUNTS/VocabDifficulty_COUNTS";

import { MyColors } from "@/src/constants/MyColors";

import Transition_BTN from "@/src/components/Transition_BTN/Transition_BTN";
import { ICON_arrow } from "@/src/components/icons/icons";
import USE_fetchVocabsOfAPublicList from "@/src/features/2_vocabs/hooks/USE_fetchVocabsOfAPublicList";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import PublicVocab_BACK from "@/src/features/2_vocabs/components/Vocab/Components/PublicVocab_BACK/PublicVocab_BACK";
import Vocab from "@/src/features/2_vocabs/components/Vocab/Vocab";
import vocabs from "../../vocabs";
import SavePublicVocabToList_MODAL from "@/src/features/2_vocabs/components/Modal/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";
import USE_fetchOnePublicList from "@/src/features/2_vocabs/hooks/USE_fetchOnePublicList";
import PublicVocabs_SUBNAV from "@/src/features/1_lists/components/PublicVocabs_SUBNAV";
import { DisplaySettings_MODAL } from "@/src/features/2_vocabs/components/Modal/DisplaySettings/DisplaySettings_MODAL/DisplaySettings_MODAL";

export default function PublicListVocabs_PAGE() {
  const { user } = USE_auth();
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { FETCH_vocabsOfPublicList, ARE_vocabsFetching, vocabs_ERROR } =
    USE_fetchVocabsOfAPublicList();
  const { FETCH_onePublicList, IS_publicListFetching, publicList_ERROR } =
    USE_fetchOnePublicList();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "save" },
    { name: "displaySettings" },
  ]);

  const [search, SET_search] = useState("");

  const [vocabs, SET_vocabs] = useState<Vocab_MODEL[]>([]);
  const [list, SET_list] = useState<List_MODEL | undefined>(undefined);

  const GET_vocabs = async () => {
    const vocabs = await FETCH_vocabsOfPublicList(id);
    if (vocabs?.success && vocabs.data) {
      SET_vocabs(vocabs.data);
    }
  };
  const GET_list = async () => {
    const list = await FETCH_onePublicList(id);
    if (list?.success && list.data) {
      SET_list(list.data);
    }
  };

  useEffect(() => {
    GET_vocabs();
    GET_list();
  }, []);

  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>();

  const [targetSave_VOCAB, SET_targetSaveVocab] = useState<
    Vocab_MODEL | undefined
  >(undefined);

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
            iconLeft={<ICON_arrow direction="left" />}
            style={{ opacity: 0, pointerEvents: "none" }}
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

      <DisplaySettings_MODAL
        open={modal_STATES.displaySettings}
        TOGGLE_open={() => TOGGLE_modal("displaySettings")}
        HAS_difficulties={false}
      />
    </Page_WRAP>
  );
}
