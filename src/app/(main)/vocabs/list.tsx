//
//
//

import { Text, View } from "react-native";
import Page_WRAP from "@/src/components/Page_WRAP/Page_WRAP";
import Btn from "@/src/components/Btn/Btn";
import { useRouter } from "expo-router";
import { Styled_TEXT } from "@/src/components/StyledText/StyledText";
import Header from "@/src/components/Header/Header";
import {
  ICON_3dots,
  ICON_arrow,
  ICON_displaySettings,
  ICON_X,
} from "@/src/components/icons/icons";
import { Vocab_MODEL } from "@/src/db/models";
import { useEffect, useState } from "react";
import { USE_selectedList } from "@/src/context/SelectedList_CONTEXT";
import SUBSCRIBE_toVocabs from "@/src/db/vocabs/SUBSCRIBE_toVocabs";
import FETCH_userVocabs from "@/src/db/vocabs/FETCH_userVocabs";
import { supabase } from "@/src/lib/supabase";
import List_SKELETONS from "@/src/components/Skeletons/List_SKELETONS";
import Styled_FLATLIST from "@/src/components/Flatlists/Styled_FLATLIST/Styled_FLATLIST";
import Vocab from "@/src/components/Vocab/Vocab";
import { DisplaySettings_MODEL } from "@/src/db/models";
import Subnav from "@/src/components/Subnav/Subnav";
import SearchBar from "@/src/components/SearchBar/SearchBar";
import { USE_toggle } from "@/src/hooks/USE_toggle";
import MyVocabs_SUBNAV from "@/src/components/Subnav/MyVocabs_SUBNAV";
import DisplaySettings_MODAL from "@/src/components/Modals/DisplaySettings_MODAL/DisplaySettings_MODAL";
import ManageVocab_MODAL from "@/src/components/Modals/ManageVocab_MODAL/ManageVocab_MODAL";

export default function SingleList_PAGE() {
  const router = useRouter();
  const { selected_LIST } = USE_selectedList();
  const [loading, SET_loading] = useState(false);
  const [SHOW_displaySettings, TOGGLE_displaySettings] = USE_toggle(false);
  const [SHOW_vocabModal, TOGGLE_vocabModal] = USE_toggle(false);

  const [displaySettings, SET_displaySettings] =
    useState<DisplaySettings_MODEL>({
      search: "",
      sorting: "difficulty",
      sortDirection: "ascending",
      SHOW_image: false,
      SHOW_listName: false,
      SHOW_description: true,
      SHOW_flags: true,
      SHOW_difficulty: true,
      frontLangId: "en",
      difficultyFilters: [],
    });

  const [vocabs, SET_vocabs] = useState<Vocab_MODEL[]>([]);
  const GET_vocabs = async () => {
    SET_loading(true);
    const res = await FETCH_userVocabs({
      filter: {
        list_id: selected_LIST.id,
        difficulties: displaySettings.difficultyFilters,
        is_public: false,
        is_publicly_visible: false,
        search: displaySettings.search,
      },
      sort: {
        type: displaySettings.sorting,
        direction: displaySettings.sortDirection,
      },
    });

    SET_vocabs([...(res?.data || [])]);
    SET_loading(false);
  };

  useEffect(() => {
    GET_vocabs();

    const subscription = SUBSCRIBE_toVocabs({ SET_vocabs });
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [displaySettings]);

  const [toEdit_VOCAB, SET_toEditVocab] = useState<Vocab_MODEL | null>(null);
  const [toEdit_TRANSLATIONS, SET_toEditTranslations] = useState<
    TranslationCreation_PROPS[] | null
  >(null);

  function HANDLE_vocabModal({
    clear = false,
    vocab,
    translations,
  }: {
    clear?: boolean;
    vocab?: Vocab_MODEL;
    translations?: TranslationCreation_PROPS[];
  }) {
    if (!clear && vocab && translations) {
      const trs = translations?.map((tr) => ({
        lang_id: tr.lang_id,
        text: tr.text || "",
        highlights: tr.highlights || "",
      }));

      SET_toEditVocab(vocab);
      SET_toEditTranslations(trs);
      TOGGLE_vocabModal();
    } else if (clear) {
      SET_toEditVocab(null);
      SET_toEditTranslations(null);
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

      <MyVocabs_SUBNAV
        search={displaySettings.search}
        SET_search={(val) =>
          SET_displaySettings((prev) => ({ ...prev, search: val }))
        }
        TOGGLE_displaySettings={TOGGLE_displaySettings}
        HANDLE_vocabModal={HANDLE_vocabModal}
      />
      {loading ? <List_SKELETONS /> : null}
      {!loading ? (
        <Styled_FLATLIST
          data={vocabs}
          renderItem={({ item }) => (
            <View>
              <Vocab
                vocab={item}
                displaySettings={displaySettings}
                selected_LIST={selected_LIST}
                HANDLE_vocabModal={HANDLE_vocabModal}
              />
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : null}

      <DisplaySettings_MODAL
        open={SHOW_displaySettings}
        TOGGLE_open={TOGGLE_displaySettings}
        displaySettings={displaySettings}
        SET_displaySettings={SET_displaySettings}
      />
      <ManageVocab_MODAL
        open={SHOW_vocabModal}
        TOGGLE_modal={() => HANDLE_vocabModal({ clear: true })}
        toEdit_VOCAB={toEdit_VOCAB}
        toEdit_TRANSLATIONS={toEdit_TRANSLATIONS}
        selected_LIST={selected_LIST}
      />
    </Page_WRAP>
  );
}
