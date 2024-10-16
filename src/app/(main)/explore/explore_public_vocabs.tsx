//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import {
  CreateMyVocab_MODAL,
  MyVocabDisplaySettings_MODAL,
  MyVocabs_HEADER,
  MyVocabs_SUBNAV,
  MyVocabs_FLATLIST,
  DeleteVocab_MODAL,
  USE_filteredVocabs,
  USE_searchedVocabs,
  PublicVocabs_SUBNAV,
  PublicVocabs_HEADER,
} from "@/src/features/2_vocabs";
import { useRouter } from "expo-router";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import { tr_PROPS } from "@/src/db/props";
import React, { useEffect, useMemo, useState } from "react";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import ListSettings_MODAL from "@/src/features/1_lists/components/ListSettings_MODAL/ListSettings_MODAL";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import USE_highlighedId from "@/src/hooks/USE_highlighedId/USE_highlighedId";
import { USE_highlightBoolean } from "@/src/hooks/USE_highlightBoolean/USE_highlightBoolean";
import { EmptyFlatList_BOTTM, List_SKELETONS } from "@/src/features/1_lists";
import { t } from "i18next";
import { useTranslation } from "react-i18next";
import GET_uniqueLanguagesInAList from "@/src/features/4_languages/utils/GET_uniqueLanguagesInAList/GET_uniqueLanguagesInAList";
import { USE_langs } from "@/src/context/Langs_CONTEXT";

import { useToast } from "react-native-toast-notifications";
import USE_zustand from "@/src/zustand";
import GET_uniqueTagsInAList from "@/src/features/future/tags/GET_uniqueTagsInAList/GET_uniqueTagsInAList";
import UpdateMyVocab_MODAL from "@/src/features/2_vocabs/components/Modal/UpdateMyVocab_MODAL/UpdateMyVocab_MODAL";
import USE_filteredPublicVocabs from "@/src/features/2_vocabs/hooks/USE_filteredPublicVocabs/USE_filteredPublicVocabs";
import USE_fetchPublicVocabs from "@/src/features/2_vocabs/hooks/USE_fetchPublicVocabs";
import { PublicVocabs_FLATLIST } from "@/src/features/2_vocabs/components/Flatlist/PublicVocabs_FLATLIST/PublicVocabs_FLATLIST";
import PublicVocabDisplaySettings_MODAL from "@/src/features/2_vocabs/components/Modal/DisplaySettings/PublicVocabDisplaySettings_MODAL/PublicVocabDisplaySettings_MODAL";
import CreatePublicVocab_MODAL from "@/src/features/2_vocabs/components/Modal/CreatePublicVocab_MODAL/CreatePublicVocab_MODAL";
import UpdatePublicVocab_MODAL from "@/src/features/2_vocabs/components/Modal/UpdatePublicVocab_MODAL/UpdatePublicVocab_MODAL";
import SavePublicVocabToList_MODAL from "@/src/features/2_vocabs/components/Modal/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";
import USE_modalToggles from "@/src/hooks/USE_modalToggles";
import { Vocab_MODEL } from "@/src/db/watermelon_MODELS";
import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";

export default function Explore_PAGE() {
  const { user } = USE_auth();
  const { t } = useTranslation();
  const toast = useToast();
  const router = useRouter();
  const [search, SET_search] = useState("");

  const { languages } = USE_langs();

  const { modal_STATES, TOGGLE_modal } = USE_modalToggles([
    { name: "displaySettings" },
    { name: "save" },
  ]);

  return (
    <Page_WRAP>
      <PublicVocabs_HEADER />
      <PublicVocabs_SUBNAV
        {...{ search, SET_search }}
        TOGGLE_createPublicVocabModal={() => TOGGLE_modal("create")}
        TOGGLE_displaySettings={() => TOGGLE_modal("displaySettings")}
        is_admin={user?.is_admin}
      />

      {/* {ARE_vocabsSearching || ARE_publicVocabsFetching ? (
        <List_SKELETONS />
      ) : null} */}

      {/* <PublicVocabs_FLATLIST
        highlightedVocab_ID={highlighted_ID}
        SHOW_bottomBtn={true}
        {...{
          search,
          PREPARE_toSaveVocab,
          PREPARE_vocabDelete,
          HANDLE_updateModal,
        }}
      /> */}
      <Styled_TEXT>Public vocabs here</Styled_TEXT>

      {/* <PublicVocabDisplaySettings_MODAL
        open={SHOW_displaySettings}
        displaySettings={displaySettings}
        TOGGLE_open={TOGGLE_displaySettings}
        SET_displaySettings={SET_displaySettings}
        available_LANGS={available_LANGS}
      />  */}

      {/* <SavePublicVocabToList_MODAL
        vocab={targetSave_VOCAB}
        trs={targetSave_TRS}
        TOGGLE_open={() => TOGGLE_modal("save")}
        IS_open={modal_STATES.save}
        user={user}
        onSuccess={() => {
          TOGGLE_modal("save");
          toast.show(t("notifications.savedVocab"), {
            type: "green",
            duration: 5000,
          });
        }}
      /> */}
    </Page_WRAP>
  );
}
