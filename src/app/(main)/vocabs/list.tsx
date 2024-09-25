//
//
//

import { Button, Text, View } from "react-native";
import Page_WRAP from "@/src/components/Compound/Page_WRAP/Page_WRAP";
import Btn from "@/src/components/Basic/Btn/Btn";
import { useRouter } from "expo-router";
import { Styled_TEXT } from "@/src/components/Basic/Styled_TEXT/Styled_TEXT";
import Header from "@/src/components/Compound/Header/Header";
import {
  ICON_3dots,
  ICON_arrow,
  ICON_displaySettings,
  ICON_X,
} from "@/src/components/Basic/icons/icons";
import { TranslationCreation_PROPS, Vocab_MODEL } from "@/src/db/models";
import { useEffect, useState } from "react";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import SUBSCRIBE_toVocabs from "@/src/db/vocabs/SUBSCRIBE_toVocabs";

import { supabase } from "@/src/lib/supabase";
import List_SKELETONS from "@/src/components/Basic/Skeletons/List_SKELETONS";
import Styled_FLATLIST from "@/src/components/Basic/Styled_FLATLIST/Styled_FLATLIST/Styled_FLATLIST";

import { DisplaySettings_MODEL } from "@/src/db/models";
import Subnav from "@/src/components/Subnav/Subnav";
import SearchBar from "@/src/components/Compound/SearchBar/SearchBar";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import PrivateVocabs_SUBNAV from "@/src/components/Subnav/Variations/PrivateVocabs_SUBNAV";
import PrivateVocabDisplaySettings_MODAL from "@/src/components/Modals/PrivateVocabDisplaySettings_MODAL/PrivateVocabDisplaySettings_MODAL";
import PrivateVocab_MODAL from "@/src/components/Modals/Vocab_MODALS/PrivateVocab_MODAL/PrivateVocab_MODAL";
import { useTranslation } from "react-i18next";
import Private_VOCAB from "@/src/components/Complex/Vocab/Private_VOCAB/Private_VOCAB";

import { MyColors } from "@/src/constants/MyColors";
import Toast from "@/src/components/Basic/Toast/Toast";

export default function SingleList_PAGE() {
  const router = useRouter();
  const { selected_LIST } = USE_selectedList();
  const [SHOW_displaySettings, TOGGLE_displaySettings] = USE_toggle(false);
  const [SHOW_vocabModal, TOGGLE_vocabModal] = USE_toggle(false);

  const [vocabs, SET_vocabs] = useState<Vocab_MODEL[]>(
    selected_LIST?.vocabs || []
  );

  const [displaySettings, SET_displaySettings] =
    useState<DisplaySettings_MODEL>({
      search: "",
      sorting: "difficulty",
      sortDirection: "ascending",
      SHOW_image: false,
      SHOW_description: true,
      SHOW_flags: true,
      SHOW_difficulty: true,
      frontLangId: "en",
      difficultyFilters: [],
    });

  const [target_VOCAB, SET_targetVocab] = useState<Vocab_MODEL | undefined>(
    undefined
  );

  const [highlightedVocab_ID, SET_highlightedVocabId] = useState("");

  const HIGHLIGHT_vocab = (id: string) => {
    if (!highlightedVocab_ID) {
      SET_highlightedVocabId(id);
      setTimeout(() => {
        SET_highlightedVocabId("");
      }, 2000);
    }
  };

  function HANDLE_vocabModal({
    clear = false,
    vocab,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
  }) {
    // return;
    if (!clear && vocab) {
      SET_targetVocab(vocab);
      TOGGLE_vocabModal();
    } else if (clear) {
      SET_targetVocab(undefined);
      TOGGLE_vocabModal();
    }
  }

  return (
    <Page_WRAP>
      <Header
        title={selected_LIST.name || "none"}
        btnLeft={
          <Btn
            type="seethrough"
            iconLeft={<ICON_arrow />}
            onPress={() => router.back()}
            style={{ borderRadius: 100 }}
          />
        }
        btnRight={
          <Btn
            type="seethrough"
            iconLeft={<ICON_3dots />}
            onPress={() => {}}
            style={{ borderRadius: 100 }}
          />
        }
      />

      <PrivateVocabs_SUBNAV
        search={displaySettings.search}
        SET_search={(val) =>
          SET_displaySettings((prev) => ({ ...prev, search: val }))
        }
        TOGGLE_displaySettings={TOGGLE_displaySettings}
        HANDLE_vocabModal={HANDLE_vocabModal}
      />
      {vocabs && vocabs.length > 0 ? (
        <Styled_FLATLIST
          data={vocabs}
          renderItem={({ item }) => (
            <Private_VOCAB
              key={"Vocab" + item.id}
              vocab={item}
              displaySettings={displaySettings}
              HANDLE_vocabModal={HANDLE_vocabModal}
              highlightedVocab_ID={highlightedVocab_ID}
            />
          )}
          keyExtractor={(item) => "Vocab" + item.id}
        />
      ) : null}

      <PrivateVocabDisplaySettings_MODAL
        open={SHOW_displaySettings}
        TOGGLE_open={TOGGLE_displaySettings}
        displaySettings={displaySettings}
        SET_displaySettings={SET_displaySettings}
      />
      <PrivateVocab_MODAL
        open={SHOW_vocabModal}
        TOGGLE_modal={() => HANDLE_vocabModal({ clear: true })}
        vocab={target_VOCAB}
        selected_LIST={selected_LIST}
        SET_vocabs={SET_vocabs}
        HIGHLIGHT_vocab={HIGHLIGHT_vocab}
      />
    </Page_WRAP>
  );
}
