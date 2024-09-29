//
//
//

import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import Header from "@/src/components/Header/Header";
import Btn from "@/src/components/Btn/Btn";
import { ICON_arrow, ICON_3dots } from "@/src/components/icons/icons";

import { CreateList_MODAL, List_SKELETONS } from "@/src/features/1_lists";
import Styled_FLATLIST from "@/src/components/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";
import PrivateVocabs_SUBNAV from "@/src/components/Subnav/Variations/PrivateVocabs_SUBNAV";
import Public_VOCAB from "@/src/features/2_vocabs/Public_VOCAB/Public_VOCAB";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import {
  List_MODEL,
  MyVocabDisplaySettings_PROPS,
  PublicVocab_MODEL,
  PublicVocabDisplaySettings_PROPS,
  User_MODEL,
  Vocab_MODEL,
} from "@/src/db/models";

import SUBSCRIBE_toVocabs from "@/src/db/vocabs/SUBSCRIBE_toVocabs";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import { supabase } from "@/src/lib/supabase";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View } from "react-native";

import { Styled_TEXT } from "@/src/components/Styled_TEXT/Styled_TEXT";
import { USE_auth } from "@/src/context/Auth_CONTEXT";
import PublicVocabs_SUBNAV from "@/src/components/Subnav/Variations/PublicVocabs_SUBNAV";
import SavePublicVocabToList_MODAL from "@/src/features/2_vocabs/Public_VOCAB/components/SavePublicVocabToList_MODAL/SavePublicVocabToList_MODAL";
import USE_copyPublicVocab from "@/src/db/vocabs/USE_copyPublicVocab";
import PublicVocabDisplaySettings_MODAL from "@/src/features/2_vocabs/Public_VOCAB/components/PublicVocabDisplaySettings_MODAL/PublicVocabDisplaySettings_MODAL";
import PublicVocab_MODAL from "@/src/features/2_vocabs/Public_VOCAB/components/PublicVocab_MODAL/PublicVocab_MODAL";
import USE_zustand from "@/src/zustand";
import FETCH_publicVocabs from "@/src/features/2_vocabs/Public_VOCAB/utils/FETCH_publicVocabs";
import PublicVocabs_HEADER from "@/src/features/2_vocabs/Public_VOCAB/components/PublicVocabs_HEADER";
import SelectMyList_MODAL from "@/src/features/1_lists/components/SelectMyList_MODAL/SelectMyList_MODAL";
import USE_createMyVocab from "@/src/features/2_vocabs/My_VOCAB/hooks/USE_createVocab";
import { useToast } from "react-native-toast-notifications";
import { useTranslation } from "react-i18next";
import { Vocab_MODAL } from "@/src/features/2_vocabs";

export default function Explore_PAGE() {
  const router = useRouter();
  const [SHOW_displaySettings, TOGGLE_displaySettings] = USE_toggle(false);
  const [SHOW_vocabModal, TOGGLE_vocabModal] = USE_toggle(false);
  const { user }: { user: User_MODEL } = USE_auth();
  const toast = useToast();
  const { t } = useTranslation();

  // const { FETCH_publicVocabs, IS_fetchingVocabs } = USE_fetchPublicVocabs();

  const [displaySettings, SET_displaySettings] =
    useState<MyVocabDisplaySettings_PROPS>({
      SHOW_image: false,
      SHOW_description: true,
      SHOW_flags: true,
      SHOW_difficulty: true,
      frontTrLang_ID: "en",
      sorting: "difficulty",
      sortDirection: "ascending",
      search: "",
      difficultyFilters: [],
    });

  const {
    z_publicVocabs,
    z_ARE_publicVocabsLoading,
    z_publicVocabs_ERROR,
    z_SET_publicVocabs,
    z_SET_publicVocabsLoading,
    z_SET_publicVocabsError,
  } = USE_zustand();

  useEffect(() => {
    (async () =>
      FETCH_publicVocabs({
        z: {
          z_SET_publicVocabs,
          z_SET_publicVocabsLoading,
          z_SET_publicVocabsError,
        },
      }))();
  }, []);

  const [publicVocab, SET_toEditVocab] = useState<Vocab_MODEL | undefined>(
    undefined
  );
  const [targetSave_VOCAB, SET_targetSaveVocab] = useState<
    Vocab_MODEL | undefined
  >(undefined);

  const [SHOW_saveVocabModal, TOGGLE_saveVocabModal] = USE_toggle();

  const { z_CREATE_privateVocab } = USE_zustand();

  const { CREATE_vocab, IS_creatingVocab } = USE_createMyVocab();

  async function create(target_LIST: List_MODEL) {
    if (!IS_creatingVocab && targetSave_VOCAB && target_LIST) {
      const newVocab = await CREATE_vocab({
        user_id: user?.id,
        list_id: target_LIST.id,
        difficulty: 3,
        image: "",
        description: targetSave_VOCAB.description,
        translations: targetSave_VOCAB.translations,
      });

      if (newVocab.success) {
        z_CREATE_privateVocab(target_LIST.id, newVocab.data);
        // SET_vocabs((prev) => [newVocab.data, ...prev]);
        TOGGLE_saveVocabModal();
        SET_targetSaveVocab(undefined);
        toast.show(t("notifications.vocabCopied"), {
          type: "custom_success",
          duration: 2000,
        });
      }
    }
  }

  const HANDLE_vocabModal = ({
    clear = false,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) => {
    // return;
    if (!clear && vocab) {
      SET_toEditVocab(vocab);
      TOGGLE_vocabModal();
    } else if (clear) {
      SET_toEditVocab(undefined);
      TOGGLE_vocabModal();
    }
  };

  const PREPARE_toSaveVocab = (vocab: Vocab_MODEL) => {
    SET_targetSaveVocab(vocab);
    TOGGLE_saveVocabModal();
  };
  const [highlightedVocab_ID, SET_highlightedVocabId] = useState("");
  const HIGHLIGHT_vocab = (id: string) => {
    if (!highlightedVocab_ID) {
      SET_highlightedVocabId(id);
      setTimeout(() => {
        SET_highlightedVocabId("");
      }, 2000);
    }
  };

  return (
    <Page_WRAP>
      <PublicVocabs_HEADER />
      {z_ARE_publicVocabsLoading && <List_SKELETONS />}
      <PublicVocabs_SUBNAV
        search={displaySettings.search}
        SET_search={(val) =>
          SET_displaySettings((prev) => ({ ...prev, search: val }))
        }
        TOGGLE_displaySettings={TOGGLE_displaySettings}
        HANDLE_vocabModal={HANDLE_vocabModal}
        IS_admin={user?.is_admin}
      />
      {!z_ARE_publicVocabsLoading && z_publicVocabs.length > 0 && (
        <Styled_FLATLIST
          data={z_publicVocabs}
          renderItem={({ item }) => {
            if (item?.id) {
              return (
                <Public_VOCAB
                  key={"PublicVocab" + item?.id}
                  vocab={item}
                  {...{
                    displaySettings,
                    IS_admin: user?.is_admin,
                    HANDLE_vocabModal,
                    PREPARE_toSaveVocab,
                  }}
                />
              );
            }
            return null;
          }}
          keyExtractor={(item) => "Vocab" + item?.id}
        />
      )}
      <PublicVocabDisplaySettings_MODAL
        open={SHOW_displaySettings}
        TOGGLE_open={TOGGLE_displaySettings}
        displaySettings={displaySettings}
        SET_displaySettings={SET_displaySettings}
      />

      {/* <PublicVocab_MODAL
        open={SHOW_vocabModal}
        TOGGLE_modal={() => HANDLE_vocabModal({ clear: true })}
        vocab={publicVocab}
        HIGHLIGHT_vocab={HIGHLIGHT_vocab}
      /> */}
      <Vocab_MODAL
        open={SHOW_vocabModal}
        TOGGLE_modal={() => HANDLE_vocabModal({ clear: true })}
        vocab={publicVocab}
        selected_LIST={null}
        SET_vocabs={(s) => {}}
        HIGHLIGHT_vocab={HIGHLIGHT_vocab}
        is_public={true}
      />

      <SelectMyList_MODAL
        open={SHOW_saveVocabModal}
        title="Saved vocab to list"
        submit_ACTION={(target_LIST: List_MODEL) => {
          if (!IS_creatingVocab) create(target_LIST);
        }}
        cancel_ACTION={() => {
          TOGGLE_saveVocabModal();
          SET_targetSaveVocab(undefined);
        }}
        IS_inAction={IS_creatingVocab}
      />
    </Page_WRAP>
  );
}
