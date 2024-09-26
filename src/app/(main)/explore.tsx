//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import Header from "@/src/components/Header/Header";
// import Btn from "@/src/components/Btn/Btn";
// import { ICON_arrow, ICON_3dots } from "@/src/components/icons/icons";
// import PrivateVocabDisplaySettings_MODAL from "@/src/components/Modals/Big_MODAL/Variations/PrivateVocabDisplaySettings_MODAL/PrivateVocabDisplaySettings_MODAL";
// import PrivateVocab_MODAL from "@/src/components/Modals/Vocab_MODALS/PrivateVocab_MODAL/PrivateVocab_MODAL";
// import List_SKELETONS from "@/src/components/Skeletons/List_SKELETONS";
// import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
// import PrivateVocabs_SUBNAV from "@/src/components/Subnav/Variations/PrivateVocabs_SUBNAV";
// import PublicVocab from "@/src/components/Vocab/PublicVocab/PublicVocab";
// import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
// import {
//   DisplaySettings_MODEL,
//   List_MODEL,
//   PublicDisplaySettings_MODEL,
//   PublicVocab_MODEL,
//   User_MODEL,
//   Vocab_MODEL,
// } from "@/src/db/models";

// import SUBSCRIBE_toVocabs from "@/src/db/vocabs/SUBSCRIBE_toVocabs";
// import { USE_toggle } from "@/src/hooks/USE_toggle";
// import { supabase } from "@/src/lib/supabase";
// import { useRouter } from "expo-router";
// import { useState, useEffect } from "react";
// import { View } from "react-native";
// import USE_fetchPublicVocabs from "@/src/db/vocabs/FETCH_publicVocabs";
// import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
// import { USE_auth } from "@/src/context/Auth_CONTEXT";
// import PublicVocabs_SUBNAV from "@/src/components/Subnav/Variations/PublicVocabs_SUBNAV";
// import SavePublicVocabToList_MODAL from "@/src/components/Modals/Vocab_MODALS/components/modals/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";
// import USE_copyPublicVocab from "@/src/db/vocabs/USE_copyPublicVocab";
// import PublicVocabDisplaySettings_MODAL from "@/src/components/Modals/Big_MODAL/Variations/PublicVocabDisplaySettings_MODAL/PublicVocabDisplaySettings_MODAL";
// import PublicVocab_MODAL from "@/src/components/Modals/Vocab_MODALS/PublicVocab_MODAL/PublicVocab_MODAL";

export default function Explore_PAGE() {
  // const router = useRouter();
  // const [SHOW_displaySettings, TOGGLE_displaySettings] = USE_toggle(false);
  // const [SHOW_vocabModal, TOGGLE_vocabModal] = USE_toggle(false);
  // const { user }: { user: User_MODEL } = USE_auth();

  // const { FETCH_publicVocabs, IS_fetchingVocabs } = USE_fetchPublicVocabs();

  // const [displaySettings, SET_displaySettings] =
  //   useState<PublicDisplaySettings_MODEL>({
  //     search: "",
  //     sorting: "difficulty",
  //     sortDirection: "ascending",
  //     SHOW_image: false,
  //     SHOW_description: true,
  //     SHOW_flags: true,
  //     frontLangId: "en",
  //   });

  // const [publicVocabs, SET_vocabs] = useState<PublicVocab_MODEL[]>([]);
  // const [publicVocab, SET_toEditVocab] = useState<
  //   PublicVocab_MODEL | undefined
  // >(undefined);
  // const [targetSave_VOCAB, SET_targetSaveVocab] = useState<
  //   PublicVocab_MODEL | undefined
  // >(undefined);
  // const [targetSave_LIST, SET_targetSaveList] = useState<
  //   List_MODEL | undefined
  // >(undefined);
  // const [SHOW_saveVocabModal, TOGGLE_saveVocabModal] = USE_toggle();

  // const GET_vocabs = async () => {
  //   const res = await FETCH_publicVocabs({
  //     filter: {
  //       search: displaySettings.search,
  //     },
  //     sort: {
  //       type: displaySettings.sorting,
  //       direction: displaySettings.sortDirection,
  //     },
  //   });

  //   SET_vocabs([...(res?.data || [])]);
  // };

  // useEffect(() => {
  //   GET_vocabs();

  //   const subscription = SUBSCRIBE_toVocabs({ SET_vocabs });
  //   return () => {
  //     supabase.removeChannel(subscription);
  //   };
  // }, [displaySettings]);

  // const HANDLE_vocabModal = ({
  //   clear = false,
  //   vocab,
  // }: {
  //   clear?: boolean;
  //   vocab?: Vocab_MODEL;
  // }) => {
  //   // return;
  //   if (!clear && vocab) {
  //     SET_toEditVocab(vocab);
  //     TOGGLE_vocabModal();
  //   } else if (clear) {
  //     SET_toEditVocab(undefined);
  //     TOGGLE_vocabModal();
  //   }
  // };

  // const PREPARE_toSaveVocab = (vovab: Vocab_MODEL) => {
  //   SET_targetSaveVocab(vovab);
  //   TOGGLE_saveVocabModal();
  // };

  return (
    <Page_WRAP>
      <Header big={true} title="Explore vocabs" />
      {/* {IS_fetchingVocabs && <Styled_TEXT>IS_fetchingVocabs...</Styled_TEXT>} */}
      {/* 
      <PublicVocabs_SUBNAV
        search={displaySettings.search}
        SET_search={(val) =>
          SET_displaySettings((prev) => ({ ...prev, search: val }))
        }
        TOGGLE_displaySettings={TOGGLE_displaySettings}
        HANDLE_vocabModal={HANDLE_vocabModal}
        IS_admin={user.is_admin}
      />
      {IS_fetchingVocabs ? <List_SKELETONS /> : null}
      {!IS_fetchingVocabs ? (
        <Styled_FLATLIST
          data={publicVocabs}
          renderItem={({ item }) => (
            <View>
              <PublicVocab
                vocab={item}
                displaySettings={displaySettings}
                HANDLE_vocabModal={HANDLE_vocabModal}
                IS_admin={user.is_admin}
                PREPARE_toSaveVocab={PREPARE_toSaveVocab}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : null}

      <PublicVocabDisplaySettings_MODAL
        open={SHOW_displaySettings}
        TOGGLE_open={TOGGLE_displaySettings}
        displaySettings={displaySettings}
        SET_displaySettings={SET_displaySettings}
      />
      <PublicVocab_MODAL
        open={SHOW_vocabModal}
        TOGGLE_modal={() => HANDLE_vocabModal({ clear: true })}
        vocab={publicVocab}
      />
      <SavePublicVocabToList_MODAL
        open={SHOW_saveVocabModal}
        TOGGLE_open={TOGGLE_saveVocabModal}
        user_id={user.id}
        SET_targetSaveList={SET_targetSaveList}
        targetSave_VOCAB={targetSave_VOCAB}
      /> */}
    </Page_WRAP>
  );
}
